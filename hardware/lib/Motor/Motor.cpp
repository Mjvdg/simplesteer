#include <Arduino.h>
#include "Motor.h"


int Motor::speedPWM = 255;
unsigned int Motor::pulseDuration = 250;
bool Motor::isPulseRunning = false;
unsigned long Motor::lastPulseTime = 0;

void Motor::turnLeft(){ 
    analogWrite(RPWM, 00);
    analogWrite(LPWM, speedPWM);
    // Serial.println("Links"+ String(speedPWM));
}
void Motor::turnRight(){
    analogWrite(RPWM, speedPWM);
    analogWrite(LPWM, 00);
    // Serial.println("Rechts" + String(RPWM ));
}
void Motor::stop(){
    analogWrite(RPWM, 00);
    analogWrite(LPWM, 00);
    // Serial.println("Stop");
}

void Motor::pulseLeft(){
    analogWrite(RPWM, 00);
    analogWrite(LPWM, speedPWM);
    isPulseRunning = true;
    lastPulseTime = millis();
    // Serial.println("Pulse Links" + RPWM);
}
void Motor::pulseRight(){
    analogWrite(RPWM, speedPWM);
    analogWrite(LPWM, 00);
    isPulseRunning = true;
    lastPulseTime = millis();
    // Serial.println("Pulse Rechts");    
}

void Motor::update(){
    unsigned long currentMillis = millis();
    if(isPulseRunning && (lastPulseTime + pulseDuration) < currentMillis){
        stop();
        isPulseRunning = false;
    }
}
