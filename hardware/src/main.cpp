#include <Arduino.h>
#include <ArduinoJson.h>
#include <Motor.h>
#include <Reader.h>

int RPWM = 5;
int LPWM = 6;
// timer 0
int L_EN = 7;
int R_EN = 8;

String inputString;
void setup() {
    Serial.begin(115200);
    while (!Serial) continue;

    for (int i = 5; i < 9; i++) {
        pinMode(i, OUTPUT);
    }
    for (int i = 5; i < 9; i++) {
        digitalWrite(i, LOW);
    }
    digitalWrite(R_EN, HIGH);
    digitalWrite(L_EN, HIGH);
    // inputString.reserve(100); 
}

void loop() {
    Motor::update();
    Reader::sendSteeringPeriodically();
    // Serial.write("{\"steer\":");
}

void processJson(JsonObject& json){
    // json.prettyPrintTo(Serial);
    if(json.containsKey("c")){
        if (json["c"]=="l") {
            Motor::turnLeft();
        }
        if (json["c"]=="r") {
            Motor::turnRight();
        }
        if (json["c"]=="s") {
            Motor::stop();
        }
        if (json["c"]=="L") {
            Motor::pulseLeft();
        }
        if (json["c"]=="R") {
            Motor::pulseRight();
        }
    }
    if(json.containsKey("d")){
        Motor::pulseDuration = json["d"];
    }
    if(json.containsKey("p")){
        Motor::speedPWM = json["p"];
    }
}

void serialEvent() {
  
  while (Serial.available()) {
    char inChar = (char)Serial.read();
    inputString += inChar;
    
    if (inChar == '\n') {
        char json[100];
        // Serial.println(inputString);
        inputString.toCharArray(json, 100);
        DynamicJsonBuffer jsonBuffer;
        JsonObject& root = jsonBuffer.parseObject(json);
        processJson(root);
        inputString = "";
    }
  }   
}
