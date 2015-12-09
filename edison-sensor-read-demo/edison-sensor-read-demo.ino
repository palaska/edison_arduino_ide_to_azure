
int base = 90;
int x;

void setup() {
  Serial.begin(9600);
}

void loop() {
  x = random(0,20);
  Serial.println(base+x);
  delay(200);

}
