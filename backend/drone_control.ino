/*
 * Drone Monitoring & Control System
 * ESP32 Backend Firmware
 *
 * Hardware: ESP32 + MPU6050
 * Communicates with the web interface over Serial / WebSocket.
 */

#include <Arduino.h>
#include <Wire.h>
#include <MPU6050.h>

// ── Pin Definitions ─────────────────────────────────────────────────────────
#define MOTOR_FL 25   // Front-Left  motor PWM pin
#define MOTOR_FR 26   // Front-Right motor PWM pin
#define MOTOR_BL 27   // Back-Left   motor PWM pin
#define MOTOR_BR 14   // Back-Right  motor PWM pin

// ── Constants ────────────────────────────────────────────────────────────────
#define SERIAL_BAUD      115200
#define LOOP_DELAY_MS    100
#define BATTERY_PIN      34    // Analog pin wired to battery voltage divider
#define BATTERY_MAX_MV   4200  // mV for fully charged LiPo cell

// ── Globals ──────────────────────────────────────────────────────────────────
MPU6050 mpu;
bool isFlying = false;

// ── Helper: read battery percentage ─────────────────────────────────────────
int readBatteryPercent() {
  int raw = analogRead(BATTERY_PIN);           // 0–4095 (12-bit ADC)
  int mv  = (raw * 3300) / 4095;              // Convert to mV (3.3 V ref)
  int pct = map(mv, 3000, BATTERY_MAX_MV, 0, 100);
  return constrain(pct, 0, 100);
}

// ── Helper: set all motors to a given speed (0–255) ──────────────────────────
void setMotors(int speed) {
  analogWrite(MOTOR_FL, speed);
  analogWrite(MOTOR_FR, speed);
  analogWrite(MOTOR_BL, speed);
  analogWrite(MOTOR_BR, speed);
}

// ── Helper: handle Serial command from web interface ─────────────────────────
void handleCommand(String cmd) {
  cmd.trim();
  if (cmd == "START") {
    isFlying = true;
    setMotors(150);
    Serial.println("STATUS:FLYING");
  } else if (cmd == "STOP") {
    isFlying = false;
    setMotors(0);
    Serial.println("STATUS:IDLE");
  } else if (cmd == "FORWARD") {
    analogWrite(MOTOR_FL, 180);
    analogWrite(MOTOR_FR, 180);
    analogWrite(MOTOR_BL, 120);
    analogWrite(MOTOR_BR, 120);
    Serial.println("CMD:FORWARD");
  } else if (cmd == "BACKWARD") {
    analogWrite(MOTOR_FL, 120);
    analogWrite(MOTOR_FR, 120);
    analogWrite(MOTOR_BL, 180);
    analogWrite(MOTOR_BR, 180);
    Serial.println("CMD:BACKWARD");
  } else if (cmd == "LEFT") {
    analogWrite(MOTOR_FL, 120);
    analogWrite(MOTOR_FR, 180);
    analogWrite(MOTOR_BL, 120);
    analogWrite(MOTOR_BR, 180);
    Serial.println("CMD:LEFT");
  } else if (cmd == "RIGHT") {
    analogWrite(MOTOR_FL, 180);
    analogWrite(MOTOR_FR, 120);
    analogWrite(MOTOR_BL, 180);
    analogWrite(MOTOR_BR, 120);
    Serial.println("CMD:RIGHT");
  } else {
    Serial.println("ERROR:UNKNOWN_COMMAND");
  }
}

// ── Setup ────────────────────────────────────────────────────────────────────
void setup() {
  Serial.begin(SERIAL_BAUD);

  // Motor pins
  pinMode(MOTOR_FL, OUTPUT);
  pinMode(MOTOR_FR, OUTPUT);
  pinMode(MOTOR_BL, OUTPUT);
  pinMode(MOTOR_BR, OUTPUT);

  // MPU6050
  Wire.begin();
  mpu.initialize();
  if (!mpu.testConnection()) {
    Serial.println("ERROR:MPU6050_NOT_FOUND");
  } else {
    Serial.println("INFO:MPU6050_OK");
  }

  Serial.println("INFO:SYSTEM_READY");
}

// ── Main Loop ─────────────────────────────────────────────────────────────────
void loop() {
  // Handle incoming commands from the web interface
  if (Serial.available()) {
    String cmd = Serial.readStringUntil('\n');
    handleCommand(cmd);
  }

  // Periodically send telemetry to the web interface
  int16_t ax, ay, az, gx, gy, gz;
  mpu.getMotion6(&ax, &ay, &az, &gx, &gy, &gz);
  int battery = readBatteryPercent();

  Serial.print("TELEMETRY:");
  Serial.print("ax="); Serial.print(ax); Serial.print(",");
  Serial.print("ay="); Serial.print(ay); Serial.print(",");
  Serial.print("az="); Serial.print(az); Serial.print(",");
  Serial.print("battery="); Serial.println(battery);

  // Basic intrusion detection: sudden spike in any axis
  if (abs(ax) > 15000 || abs(ay) > 15000 || abs(az) > 15000) {
    Serial.println("ALERT:INTRUSION_DETECTED");
  }

  delay(LOOP_DELAY_MS);
}
