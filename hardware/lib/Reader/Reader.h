class Reader
{
    private:
        static unsigned long lastReadTime;
        static void sendSteeringData(int data);

    public:
        static void sendSteeringPeriodically();
};