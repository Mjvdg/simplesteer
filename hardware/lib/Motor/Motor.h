class Motor
{
    private:
        const static int RPWM = 5;
        const static int LPWM = 6;
        const static int L_EN = 7;
        const static int R_EN = 8;
        static bool isPulseRunning;
        static unsigned long lastPulseTime;

    public: 
        static int speedPWM;
        static unsigned int pulseDuration;
        static void turnLeft();
        static void turnRight();
        static void stop();
        static void pulseLeft();
        static void pulseRight();
        static void update();
};