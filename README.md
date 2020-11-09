<!--
author:   André Dietrich

email:    LiaScript@web.de

version:  0.0.1

language: en

narrator: US English Female

comment:  Try to write a short comment about
          your course, multiline is also okay.

script:   dist/index.js


@AVR8js.sketch: @AVR8js.project(@0,sketch.ino)

@AVR8js.project
<script>
let id = "@0"

let name = [
  "@1", "@2", "@3", "@4", "@5", "@6", "@7", "@8", "@9"
  ]
  .map((e) => e.trim())
  .filter((e) => { return (e[0] !== '@' && e !== "") })

let content = [
  `@input(0)`,
  `@input(1)`,
  `@input(2)`,
  `@input(3)`,
  `@input(4)`,
  `@input(5)`,
  `@input(6)`,
  `@input(7)`,
  `@input(8)`,
  `@input(9)`
  ]

let sketch;
let files = []

for(let i=0; i<name.length; i++) {
  if (name[i] == "sketch.ino") {
    sketch = content[i]
  } else {
    files.push({name: name[i], content: content[i]})
  }
}

AVR8js.build(sketch, files)
   .then((e) => {
     if (e.stderr) {
       let msgs = []

       for(let i = 0; i<name.length; i++) {
         msgs.push([])
       }

       let iter = e.stderr.matchAll(/(\w+\.\w+):(\d+):(\d+): ([^:]+):(.+)/g)

       for(let err=iter.next(); !err.done; err=iter.next()) {
         msgs[name.findIndex((e) => e==err.value[1])].push({
           row :    parseInt(err.value[2]) - 1,
           column : parseInt(err.value[3]),
           text :   err.value[5],
           type :   err.value[4]
         })
       }
       send.lia(e.stderr, msgs, false)
       send.lia("LIA: stop")
     }
     else {
       console.debug(e.stdout)

       if (e.hex) {
         let runner = AVR8js.execute(e.hex, console.log, id)

         send.lia("LIA: terminal")

         send.handle("stop", e => {
           if(runner) {
             runner.stop()
             runner = null
             console.debug("execution stopped")
           }
         })
       } else {
         send.lia("LIA: stop")
       }
     }
   })
"LIA: wait"
</script>

@end

-->

# AVR8js - Template

<div id="example1">
  <wokwi-led color="red"   pin="13" port="B" label="13"></wokwi-led>
  <wokwi-led color="green" pin="12" port="B"></wokwi-led>
  <wokwi-led color="blue"  pin="11" port="B"></wokwi-led>
  <wokwi-led color="blue"  pin="10" port="B"></wokwi-led>
  <wokwi-led color="white" pin="9"  port="B"></wokwi-led>


</div>

``` cpp
byte leds[] = {13, 12, 11, 10};
void setup() {
  Serial.begin(115200);
  for (byte i = 0; i < sizeof(leds); i++) {
    pinMode(leds[i], OUTPUT);
  }
}

int i = 0;
void loop() {
  Serial.print("LED: ");
  Serial.println(i);
  digitalWrite(leds[i], HIGH);
  delay(250);
  digitalWrite(leds[i], LOW);
  i = (i + 1) % sizeof(leds);
}
```
@AVR8js.sketch(example1)

-------------------------------------
second example:

<div id="exmaple2">
  <wokwi-buzzer color="red"   pin="13" port="B" label="13"></wokwi-buzzer>
  <wokwi-led color="green" pin="12" port="B"></wokwi-led>
  <wokwi-led color="blue"  pin="11" port="B"></wokwi-led>
  <wokwi-led color="blue"  pin="10" port="B"></wokwi-led>
  <wokwi-led color="white" pin="9"  port="B"></wokwi-led>

  <wokwi-7segment port="B" digits="2" ></wokwi-7segment>

  <wokwi-pushbutton port="B" pin="12" ></wokwi-pushbutton>
</div>

``` cpp
byte leds[] = {13, 12, 11, 10};
void setup() {
  Serial.begin(115200);
  for (byte i = 0; i < sizeof(leds); i++) {
    pinMode(leds[i], OUTPUT);
  }
}

int i = 0;
void loop() {
  Serial.print("LED: ");
  Serial.println(i);
  digitalWrite(leds[i], HIGH);
  delay(250);
  digitalWrite(leds[i], LOW);
  i = (i + 1) % sizeof(leds);
}
```
@AVR8js.sketch(example2)

## assumes

<div>
  <wokwi-pushbutton port="D" pin="2" ></wokwi-pushbutton>
  <wokwi-led color="green" pin="11" port="B"></wokwi-led>
  <wokwi-led color="black" pin="12" port="B"></wokwi-led>
</div>

``` cpp
void setup() {
  Serial.begin(115200);
  pinMode(2, INPUT_PULLUP);
  pinMode(11, OUTPUT);
  pinMode(12, OUTPUT);
}

int i = 0;
void loop() {
  int b = digitalRead(2);
  Serial.print("LED: ");
  Serial.println(b);
  digitalWrite(11, b);
  delay(250);

  i += 1;

  digitalWrite(12, i % 2);
}
```
@AVR8js.sketch


## Buttons

<div id="game-container">
  <wokwi-pushbutton color="red" pin="2" port="D"></wokwi-pushbutton>
  <wokwi-led color="red" label="9" pin="9" port="D"></wokwi-led>
  <wokwi-led color="green" label="10" pin="10" port="D"></wokwi-led>
  <wokwi-pushbutton color="green" pin="3" port="D"></wokwi-pushbutton>
  <wokwi-pushbutton color="blue" pin="4" port="D"></wokwi-pushbutton>
  <wokwi-led color="blue" label="11" pin="11" port="D"></wokwi-led>
  <wokwi-led color="yellow" label="12" pin="12" port="D"></wokwi-led>
  <wokwi-pushbutton color="yellow" pin="5" port="D"></wokwi-pushbutton>
</div>

``` cpp           sketch.ino
/**
   Simon Game for Arduino

   Copyright (C) 2016, Uri Shaked

   Licensed under the MIT License.
*/

#include "pitches.h"

/* Constants - define pin numbers for leds, buttons and speaker, and also the game tones */
char ledPins[] = {9, 10, 11, 12};
char buttonPins[] = {2, 3, 4, 5};
#define SPEAKER_PIN 8

// If you run this code directly on the WeMos D1 Mini Board, use the following pin mapping:
//char ledPins[] = {D1, D3, D0, D8};
//char buttonPins[] = {D4, D5, D6, D7};
//#define SPEAKER_PIN D2

#define MAX_GAME_LENGTH 100

int gameTones[] = { NOTE_G3, NOTE_C4, NOTE_E4, NOTE_G5};

/* Global variales - store the game state */
byte gameSequence[MAX_GAME_LENGTH] = {0};
byte gameIndex = 0;

/**
   Set up the Arduino board and initialize Serial communication
*/
void setup() {
  Serial.begin(9600);
  for (int i = 0; i < 4; i++) {
    pinMode(ledPins[i], OUTPUT);
    pinMode(buttonPins[i], INPUT_PULLUP);
  }
  pinMode(SPEAKER_PIN, OUTPUT);
  // The following line primes the random number generator. It assumes pin A0 is floating (disconnected)
  randomSeed(analogRead(A0));
}

/**
   Lights the given led and plays the suitable tone
*/
void lightLedAndPlaySound(byte ledIndex) {
  digitalWrite(ledPins[ledIndex], HIGH);
  tone(SPEAKER_PIN, gameTones[ledIndex]);
  delay(300);
  digitalWrite(ledPins[ledIndex], LOW);
  noTone(SPEAKER_PIN);
}

/**
   Plays the current sequence of notes that the user has to repeat
*/
void playSequence() {
  for (int i = 0; i < gameIndex; i++) {
    char currentLed = gameSequence[i];
    lightLedAndPlaySound(currentLed);
    delay(50);
  }
}

/**
    Waits until the user pressed one of the buttons, and returns the index of that button
*/
byte readButton() {
  for (;;) {
    for (int i = 0; i < 4; i++) {
      byte buttonPin = buttonPins[i];
      if (digitalRead(buttonPin) == LOW) {
        return i;
      }
    }
    delay(1);
  }
}

/**
  Play the game over sequence, and report the game score
*/
void gameOver() {
  Serial.print("Game over! your score: ");
  Serial.println(gameIndex - 1);
  gameIndex = 0;
  delay(200);
  // Play a Wah-Wah-Wah-Wah sound
  tone(SPEAKER_PIN, NOTE_DS5);
  delay(300);
  tone(SPEAKER_PIN, NOTE_D5);
  delay(300);
  tone(SPEAKER_PIN, NOTE_CS5);
  delay(300);
  for (int i = 0; i < 200; i++) {
    tone(SPEAKER_PIN, NOTE_C5 + (i % 20 - 10));
    delay(5);
  }
  noTone(SPEAKER_PIN);
  delay(500);
}

/**
   Get the user input and compare it with the expected sequence. If the user fails, play the game over sequence and restart the game.
*/
void checkUserSequence() {
  for (int i = 0; i < gameIndex; i++) {
    char expectedButton = gameSequence[i];
    char actualButton = readButton();
    lightLedAndPlaySound(actualButton);
    if (expectedButton == actualButton) {
      /* good */
    } else {
      gameOver();
      return;
    }
  }
}

/**
   Plays an hooray sound whenever the user finishes a level
*/
void levelUp() {
  tone(SPEAKER_PIN, NOTE_E4);
  delay(150);
  tone(SPEAKER_PIN, NOTE_G4);
  delay(150);
  tone(SPEAKER_PIN, NOTE_E5);
  delay(150);
  tone(SPEAKER_PIN, NOTE_C5);
  delay(150);
  tone(SPEAKER_PIN, NOTE_D5);
  delay(150);
  tone(SPEAKER_PIN, NOTE_G5);
  delay(150);
  noTone(SPEAKER_PIN);
}

/**
   The main game loop
*/
void loop() {
  // Add a random color to the end of the sequence
  gameSequence[gameIndex] = random(0, 4);
  gameIndex++;

  playSequence();
  checkUserSequence();
  delay(300);

  if (gameIndex > 0) {
    levelUp();
    delay(300);
  }
}
```
``` cpp             -piches.h
/*************************************************
 * Public Constants
 *************************************************/

#define NOTE_B0  31
#define NOTE_C1  33
#define NOTE_CS1 35
#define NOTE_D1  37
#define NOTE_DS1 39
#define NOTE_E1  41
#define NOTE_F1  44
#define NOTE_FS1 46
#define NOTE_G1  49
#define NOTE_GS1 52
#define NOTE_A1  55
#define NOTE_AS1 58
#define NOTE_B1  62
#define NOTE_C2  65
#define NOTE_CS2 69
#define NOTE_D2  73
#define NOTE_DS2 78
#define NOTE_E2  82
#define NOTE_F2  87
#define NOTE_FS2 93
#define NOTE_G2  98
#define NOTE_GS2 104
#define NOTE_A2  110
#define NOTE_AS2 117
#define NOTE_B2  123
#define NOTE_C3  131
#define NOTE_CS3 139
#define NOTE_D3  147
#define NOTE_DS3 156
#define NOTE_E3  165
#define NOTE_F3  175
#define NOTE_FS3 185
#define NOTE_G3  196
#define NOTE_GS3 208
#define NOTE_A3  220
#define NOTE_AS3 233
#define NOTE_B3  247
#define NOTE_C4  262
#define NOTE_CS4 277
#define NOTE_D4  294
#define NOTE_DS4 311
#define NOTE_E4  330
#define NOTE_F4  349
#define NOTE_FS4 370
#define NOTE_G4  392
#define NOTE_GS4 415
#define NOTE_A4  440
#define NOTE_AS4 466
#define NOTE_B4  494
#define NOTE_C5  523
#define NOTE_CS5 554
#define NOTE_D5  587
#define NOTE_DS5 622
#define NOTE_E5  659
#define NOTE_F5  698
#define NOTE_FS5 740
#define NOTE_G5  784
#define NOTE_GS5 831
#define NOTE_A5  880
#define NOTE_AS5 932
#define NOTE_B5  988
#define NOTE_C6  1047
#define NOTE_CS6 1109
#define NOTE_D6  1175
#define NOTE_DS6 1245
#define NOTE_E6  1319
#define NOTE_F6  1397
#define NOTE_FS6 1480
#define NOTE_G6  1568
#define NOTE_GS6 1661
#define NOTE_A6  1760
#define NOTE_AS6 1865
#define NOTE_B6  1976
#define NOTE_C7  2093
#define NOTE_CS7 2217
#define NOTE_D7  2349
#define NOTE_DS7 2489
#define NOTE_E7  2637
#define NOTE_F7  2794
#define NOTE_FS7 2960
#define NOTE_G7  3136
#define NOTE_GS7 3322
#define NOTE_A7  3520
#define NOTE_AS7 3729
#define NOTE_B7  3951
#define NOTE_C8  4186
#define NOTE_CS8 4435
#define NOTE_D8  4699
#define NOTE_DS8 4978
```
@AVR8js.project( ,sketch.ino,pitches.h)