var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * Minimal Intel HEX loader
 * Part of AVR8js
 *
 * Copyright (C) 2019, Uri Shaked
 */
System.register("intelhex", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    function loadHex(source, target) {
        for (var _i = 0, _a = source.split('\n'); _i < _a.length; _i++) {
            var line = _a[_i];
            if (line[0] === ':' && line.substr(7, 2) === '00') {
                var bytes = parseInt(line.substr(1, 2), 16);
                var addr = parseInt(line.substr(3, 4), 16);
                for (var i = 0; i < bytes; i++) {
                    target[addr + i] = parseInt(line.substr(9 + i * 2, 2), 16);
                }
            }
        }
    }
    exports_1("loadHex", loadHex);
    return {
        setters: [],
        execute: function () {/**
             * Minimal Intel HEX loader
             * Part of AVR8js
             *
             * Copyright (C) 2019, Uri Shaked
             */
        }
    };
});
System.register("execute", ["avr8js", "intelhex"], function (exports_2, context_2) {
    "use strict";
    var avr8js_1, intelhex_1, FLASH, AVRRunner;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (avr8js_1_1) {
                avr8js_1 = avr8js_1_1;
            },
            function (intelhex_1_1) {
                intelhex_1 = intelhex_1_1;
            }
        ],
        execute: function () {
            // ATmega328p params
            FLASH = 0x8000;
            //const PORTS:Array<PORT> = ['B','C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L'];
            AVRRunner = /** @class */ (function () {
                function AVRRunner(hex) {
                    var _this = this;
                    this.program = new Uint16Array(FLASH);
                    this.port = new Map();
                    this.MHZ = 16e6;
                    this.stopped = false;
                    intelhex_1.loadHex(hex, new Uint8Array(this.program.buffer));
                    this.cpu = new avr8js_1.CPU(this.program);
                    this.timer0 = new avr8js_1.AVRTimer(this.cpu, avr8js_1.timer0Config);
                    this.timer1 = new avr8js_1.AVRTimer(this.cpu, avr8js_1.timer1Config);
                    this.timer2 = new avr8js_1.AVRTimer(this.cpu, avr8js_1.timer2Config);
                    //this.port.set('A', new AVRIOPort(this.cpu, portAConfig));
                    this.port.set('B', new avr8js_1.AVRIOPort(this.cpu, avr8js_1.portBConfig));
                    this.port.set('C', new avr8js_1.AVRIOPort(this.cpu, avr8js_1.portCConfig));
                    this.port.set('D', new avr8js_1.AVRIOPort(this.cpu, avr8js_1.portDConfig));
                    //this.port.set('E', new AVRIOPort(this.cpu, portEConfig));
                    //this.port.set('F', new AVRIOPort(this.cpu, portFConfig));
                    //this.port.set('G', new AVRIOPort(this.cpu, portGConfig));
                    //this.port.set('H', new AVRIOPort(this.cpu, portHConfig));
                    //this.port.set('J', new AVRIOPort(this.cpu, portJConfig));
                    //this.port.set('K', new AVRIOPort(this.cpu, portKConfig));
                    //this.port.set('L', new AVRIOPort(this.cpu, portLConfig));
                    // create an ArrayBuffer with a size in bytes
                    this.serialBuffer = [];
                    this.usart = new avr8js_1.AVRUSART(this.cpu, avr8js_1.usart0Config, this.MHZ);
                    this.cpu.readHooks[avr8js_1.usart0Config.UDR] = function () { return _this.serialBuffer.shift() || 0; };
                }
                AVRRunner.prototype.execute = function (callback, cyclesPerFrame, frameTimeout) {
                    if (cyclesPerFrame === void 0) { cyclesPerFrame = 500000; }
                    if (frameTimeout === void 0) { frameTimeout = 0; }
                    return __awaiter(this, void 0, void 0, function () {
                        var ucsra;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    this.stopped = false;
                                    _a.label = 1;
                                case 1:
                                    avr8js_1.avrInstruction(this.cpu);
                                    this.timer0.tick();
                                    this.timer1.tick();
                                    this.timer2.tick();
                                    this.usart.tick();
                                    if (!(this.cpu.cycles % cyclesPerFrame === 0)) return [3 /*break*/, 3];
                                    callback(this.cpu);
                                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, frameTimeout); })];
                                case 2:
                                    _a.sent();
                                    if (this.stopped) {
                                        return [3 /*break*/, 5];
                                    }
                                    _a.label = 3;
                                case 3:
                                    ucsra = this.cpu.data[avr8js_1.usart0Config.UCSRA];
                                    if (this.cpu.interruptsEnabled && ucsra & 0x20 && this.serialBuffer.length > 0) {
                                        avr8js_1.avrInterrupt(this.cpu, avr8js_1.usart0Config.rxCompleteInterrupt);
                                    }
                                    _a.label = 4;
                                case 4: return [3 /*break*/, 1];
                                case 5: return [2 /*return*/];
                            }
                        });
                    });
                };
                AVRRunner.prototype.serial = function (input) {
                    for (var i = 0; i < input.length; i++) {
                        this.serialBuffer.push(input.charCodeAt(i));
                    }
                };
                AVRRunner.prototype.stop = function () {
                    this.stopped = true;
                };
                return AVRRunner;
            }());
            exports_2("AVRRunner", AVRRunner);
        }
    };
});
System.register("format-time", [], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function zeroPad(value, length) {
        var sval = value.toString();
        while (sval.length < length) {
            sval = '0' + sval;
        }
        return sval;
    }
    function formatTime(seconds) {
        var ms = Math.floor(seconds * 1000) % 1000;
        var secs = Math.floor(seconds % 60);
        var mins = Math.floor(seconds / 60);
        return zeroPad(mins, 2) + ":" + zeroPad(secs, 2) + "." + zeroPad(ms, 3);
    }
    exports_3("formatTime", formatTime);
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("index", ["@wokwi/elements", "execute", "format-time"], function (exports_4, context_4) {
    "use strict";
    var execute_1, format_time_1;
    var __moduleName = context_4 && context_4.id;
    function pinPort(e) {
        var port;
        var pin = e.getAttribute("pin");
        pin = pin ? parseInt(pin, 10) : null;
        if (pin == null) {
            port = null;
        }
        else if (pin < 8) {
            port = 'D';
        }
        else if (pin < 14) {
            port = 'B';
        }
        else if (pin < 20) {
            port = 'C';
        }
        else {
            port = null;
        }
        return [pin, port];
    }
    return {
        setters: [
            function (_1) {
            },
            function (execute_1_1) {
                execute_1 = execute_1_1;
            },
            function (format_time_1_1) {
                format_time_1 = format_time_1_1;
            }
        ],
        execute: function () {
            window.AVR8js = {
                build: function (sketch, files) {
                    if (files === void 0) { files = []; }
                    return __awaiter(this, void 0, void 0, function () {
                        var body, resp, rslt;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!window.__AVR8jsCache) {
                                        window.__AVR8jsCache = {};
                                    }
                                    body = JSON.stringify({ sketch: sketch, files: files });
                                    if (!window.__AVR8jsCache[body]) return [3 /*break*/, 1];
                                    return [2 /*return*/, window.__AVR8jsCache[body]];
                                case 1: return [4 /*yield*/, fetch('https://hexi.wokwi.com/build', {
                                        method: 'POST',
                                        mode: 'cors',
                                        cache: 'force-cache',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: body
                                    })];
                                case 2:
                                    resp = _a.sent();
                                    return [4 /*yield*/, resp.json()];
                                case 3:
                                    rslt = _a.sent();
                                    window.__AVR8jsCache[body] = rslt;
                                    return [2 /*return*/, rslt];
                            }
                        });
                    });
                },
                buildASM: function asmToHex(source) {
                    return __awaiter(this, void 0, void 0, function () {
                        var resp;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, fetch('https://hexi.wokwi.com/asm', {
                                        method: 'POST',
                                        mode: 'cors',
                                        cache: 'no-cache',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({ source: source })
                                    })];
                                case 1:
                                    resp = _a.sent();
                                    return [4 /*yield*/, resp.json()];
                                case 2: return [2 /*return*/, (_a.sent())];
                            }
                        });
                    });
                },
                execute: function (hex, log, id, MHZ, cyclesPerFrame, frameTimeout) {
                    if (cyclesPerFrame === void 0) { cyclesPerFrame = 500000; }
                    if (frameTimeout === void 0) { frameTimeout = 0; }
                    var PORTS = ["B", "C", "D"];
                    var container = document.getElementById(id) || document;
                    var LEDs = container.querySelectorAll("wokwi-led");
                    var SEG7 = container.querySelectorAll("wokwi-7segment");
                    var BUZZER = container.querySelectorAll("wokwi-buzzer");
                    var PushButton = container.querySelectorAll("wokwi-pushbutton");
                    var runner = new execute_1.AVRRunner(hex);
                    MHZ = MHZ || 16000000;
                    var _loop_1 = function (PORT) {
                        // Hook to PORTB register
                        var port = runner.port.get(PORT);
                        if (port) {
                            PushButton.forEach(function (button) {
                                var _a = pinPort(button), pin = _a[0], p = _a[1];
                                if (pin && p === PORT) {
                                    port.setPin(pin % 8, false);
                                    button.addEventListener("button-press", function () {
                                        if (runner && pin && p === PORT) {
                                            port.setPin(pin % 8, true);
                                        }
                                    });
                                    button.addEventListener("button-release", function () {
                                        if (runner && pin && p === PORT) {
                                            port.setPin(pin % 8, false);
                                        }
                                    });
                                }
                            });
                            port.addListener(function (value) {
                                LEDs.forEach(function (e) {
                                    var _a = pinPort(e), pin = _a[0], p = _a[1];
                                    if (pin && p === PORT) {
                                        e.value = value & (1 << (pin - 8)) ? true : false;
                                    }
                                });
                                BUZZER.forEach(function (e) {
                                    var _a = pinPort(e), pin = _a[0], p = _a[1];
                                    if (pin && p === PORT) {
                                        e.hasSignal = value & (1 << (pin - 8)) ? true : false;
                                    }
                                });
                                SEG7.forEach(function (e) {
                                    var _a = pinPort(e), pin = _a[0], p = _a[1];
                                    if (pin && p === PORT) {
                                        e.values = [
                                            value & 1,
                                            value & 2,
                                            value & 4,
                                            value & 16,
                                            value & 32,
                                            value & 64,
                                            value & 128,
                                            value & 256
                                        ];
                                    }
                                });
                            });
                        }
                    };
                    for (var _i = 0, PORTS_1 = PORTS; _i < PORTS_1.length; _i++) {
                        var PORT = PORTS_1[_i];
                        _loop_1(PORT);
                    }
                    // Serial port output support
                    runner.usart.onLineTransmit = function (value) {
                        log(value);
                    };
                    var timeSpan = container.querySelector("#simulation-time");
                    runner.execute(function (cpu) {
                        var time = format_time_1.formatTime(cpu.cycles / MHZ);
                        if (timeSpan)
                            timeSpan.textContent = "Simulation time: " + time + " (cycles: " + cpu.cycles + ")";
                    });
                    return runner;
                }
            };
        }
    };
});
