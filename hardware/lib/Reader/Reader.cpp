#include <Arduino.h>
#include <Reader.h>
unsigned long Reader::lastReadTime;

void Reader::sendSteeringPeriodically(){
    unsigned long currentMillis = millis();
    if( (currentMillis - lastReadTime) > 100 ){
        lastReadTime = currentMillis;
        Reader::sendSteeringData(analogRead(6));
    } 
}; 

void Reader::sendSteeringData(int data){
    Serial.println("{\"steer\":" + String(data) + String("}"));
};