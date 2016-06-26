System.register(['@angular/core', 'rxjs/Rx', '@angular/http'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, Rx_1, http_1;
    var ProbeService;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Rx_1_1) {
                Rx_1 = Rx_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            }],
        execute: function() {
            ProbeService = (function () {
                function ProbeService(http) {
                    var _this = this;
                    this.http = http;
                    // Observable string ressource for showing update of one probe
                    this._probeUpdated = new Rx_1.Subject();
                    // Observable streams
                    this.probeUpdated$ = this._probeUpdated.asObservable();
                    this.getProbes = function () {
                        // refresh observable during the load form the API
                        if (_this._probesListObserver != undefined) {
                            _this._probesListObserver.next(_this._listDataStore.probeData);
                        }
                        // if (this._listDataStore.probeData) {
                        //     // var $this = this;
                        //     // this._listDataStore.probeData.forEach((probe) => {
                        //     //     $this._probeUpdated.next(probe.pid);
                        //     // });
                        // }
                        _this.http.get("api/probeslist")
                            .map(_this.extractProbeList)
                            .subscribe(function (probes) {
                            _this.updateProbes(probes);
                        });
                    };
                    this.extractProbeList = function (response) {
                        var probes = response.json();
                        _this.updateProbes(probes);
                        return probes;
                    };
                    this.updateProbes = function (probes) {
                        var $this = _this;
                        probes.forEach(function (probe, i) {
                            if ($this._listDataStore.probeData[i]) {
                                Object.assign($this._listDataStore.probeData[i], probe);
                            }
                            else {
                                $this._listDataStore.probeData[i] = probe;
                            }
                            $this._probeUpdated.next(probe.pid);
                        });
                    };
                    this.updateDataStoreCount = function (sensor) {
                        var $this = _this;
                        _this._listDataStore.probeData.some(function (probe, i) {
                            if (probe.pid === sensor.pid) {
                                $this._listDataStore.probeData[i].numberofmeasures += 1;
                                $this._probeUpdated.next(probe.pid);
                                if ($this._listDataStore.probeData[i].sensorstats) {
                                    $this._listDataStore.probeData[i].sensorstats.some(function (_sensor, j) {
                                        if (sensor.id === _sensor.sensordata.id) {
                                            $this._listDataStore.probeData[i].sensorstats[j].count += 1;
                                        }
                                    });
                                }
                                return true;
                            }
                        });
                    };
                    this.getProbe = function (id) {
                        var foundProbe;
                        _this._listDataStore.probeData.some(function (probe, i) {
                            if (probe.pid === id) {
                                foundProbe = probe;
                                return true;
                            }
                        });
                        return foundProbe;
                    };
                    this.getProbeDetail = function (id) {
                        return _this.http.get("api/probesensorsstats/" + id)
                            .map(_this.extractProbeDetail);
                    };
                    this.extractProbeDetail = function (response) {
                        var probe = response.json();
                        _this.updateProbeDetail(probe);
                        return probe;
                    };
                    this.updateProbeDetail = function (_probe) {
                        var $this = _this;
                        _this._listDataStore.probeData.some(function (probe, i) {
                            if (probe.pid === _probe.pid) {
                                $this._listDataStore.probeData[i].sensorstats = _probe.sensorstats;
                                return true;
                            }
                        });
                    };
                    this.updateProbe = function (_probe) {
                        var probe;
                        var body = JSON.stringify(_probe);
                        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
                        var options = new http_1.RequestOptions({ headers: headers });
                        var $this = _this;
                        _this.http.put('api/probe/' + _probe.pid, body, options)
                            .map(function (response) { return response.json(); })
                            .subscribe(function (data) {
                            $this._listDataStore.probeData.some(function (probe, i) {
                                if (probe.pid === _probe.pid) {
                                    probe.location = data.location;
                                    return true;
                                }
                            });
                        }, function (err) { return _this.logError(err); });
                        // () => console.log('subscribe ')
                    };
                    this.probesList$ = new Rx_1.Observable(function (observer) { return _this._probesListObserver = observer; }).share();
                    this._listDataStore = { probeData: [] };
                }
                ProbeService.prototype.logError = function (err) {
                    console.error('There was an error: ' + err);
                };
                ProbeService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ProbeService);
                return ProbeService;
            }());
            exports_1("ProbeService", ProbeService);
        }
    }
});
//# sourceMappingURL=probe.service.js.map