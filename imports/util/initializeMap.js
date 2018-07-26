import React from 'react';
import Events from '/imports/util/events';
import ClassPricing from "/imports/api/classPricing/fields";
import { browserHistory } from 'react-router';
import ClassType from "/imports/api/classType/fields";
import {cutString} from '/imports/util';
import config from '/imports/config';
import { isEmpty, isNumber } from 'lodash';
import { MarkerClusterer } from '/imports/ui/components/landing/components/jss/markerclusterer';

let mc;
let infobox;
let ibOptions;
let googleMarkers = [];
let locations = [];

let InfoBoxInstance;

const mapOptions = {
    zoom: 8,
    scrollwheel: true,
    minZoom: 1,
    center: { lat: -25.363, lng: 131.044 }
};


function infoSchool({school, classTypes}) {
    if(school) {
        let backgroundUrl = school.mainImage || "images/SkillShape-Whitesmoke.png";
        const schoolName = school ? cutString(school.name, 30) : "";
        Events.trigger("getSeletedSchoolData",{school});
        const view = getSchoolViewOnMap(classTypes, backgroundUrl, schoolName);
        return view;
    }
    return
}

export function createMarkersOnMap(mapId, locationData) {
    if(document.getElementById(mapId)) {
        let map = new google.maps.Map(document.getElementById(mapId), {zoom: 5});
        let i = 0;
            for(let obj of locationData) {

                if(obj.loc && isNumber(obj.loc[0]) && isNumber(obj.loc[1])) {
                    let geolocate = new google.maps.LatLng(obj.loc[0], obj.loc[1])
                    let marker = new google.maps.Marker({
                        position: geolocate,
                        map: map
                    });
                    google.maps.event.addListener(marker, 'click', function() {
                        const address = `<div id="address-content">
                         ${obj.address}, ${obj.city}, ${obj.country}
                        </div>`
                        let infowindow = new google.maps.InfoWindow();
                        infowindow.setContent(address);
                        infowindow.open(map, marker);
                    });

                    if(i=== 0) {
                        map.setCenter(geolocate);
                    }
                    i++;
                }
            }
    }
}

export function reCenterMap(map, center) {
    map && map.panTo(new google.maps.LatLng(center[0], center[1]));
    return map;
}

export function initializeSchoolEditLocationMap(location) {
    const mapId = location && `goolge-map-${location._id}`;
    if (location && document.getElementById(mapId)) {
        document.getElementById(mapId).innerHTML = ""
        let geolocate;
        let map = new google.maps.Map(document.getElementById(mapId), mapOptions);

        geolocate = new google.maps.LatLng(location.loc[0], location.loc[1])
        map.setCenter(geolocate);

        let marker = new google.maps.Marker({
            position: geolocate,
            map: map
        });
    }
}

export function initializeMap(center) {
    if (document.getElementById('google-map')) {
        import('/imports/ui/components/landing/components/jss/infoBox').then(InfoBox => {
            InfoBoxInstance = InfoBox.InfoBox;

            ibOptions = {
                content: '',
                disableAutoPan: false,
                maxWidth: 0,
                zIndex: null,
                boxStyle: {
                    padding: "0px 0px 0px 0px",
                    width: "300px",
                    height: "325px"
                },
                closeBoxURL: "",
                pane: "floatPane",
                isHidden: false,
                enableEventPropagation: false,
                pixelOffset: new google.maps.Size(-140, 0),
                infoBoxClearance: new google.maps.Size(1, 1),
            };
        });
        document.getElementById('google-map').innerHTML = ""
        let geolocate;
        let map = new google.maps.Map(document.getElementById('google-map'), mapOptions);

        geolocate = new google.maps.LatLng(center[0], center[1])
        map.setCenter(geolocate);
        let mcOptions = {  maxZoom: 12 };
        mc = new MarkerClusterer(map, [], mcOptions);
        // if (!!navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(function(position) {
        //         geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //         map.setCenter(geolocate);
        //     });
        // } else {
        //     geolocate = new google.maps.LatLng(config.defaultLocation[0], config.defaultLocation[1])
        //     map.setCenter(geolocate);
        // }

        let marker = new google.maps.Marker({
            position: geolocate,
            icon: '/images/bluecircle.png',
            map: map
        });
        let countDebounce = 0;
        google.maps.event.addListener(map, "idle", function() {
            _.debounce(()=> {
                bounds = map.getBounds();
                NEPoint = [bounds.getNorthEast().lat(),bounds.getNorthEast().lng()];
                SWPoint = [bounds.getSouthWest().lat(),bounds.getSouthWest().lng()];
                browserHistory.push({
                  pathname: '',
                  search: `?zoom=${map.getZoom()}&SWPoint=${SWPoint}&NEPoint=${NEPoint}`
                })
            },countDebounce)();
            countDebounce = 5000;
        });
        return map;
    }
}

export function setMarkersOnMap(map, SLocation) {
    if(mc) {

        let previousLocation = [...locations];
        let newMakers = [];
        let deleteMakers = [];
        let infoBoxes = [];
        let oldMarkers = mc.getMarkers() || [];
        let oldMarkersLocationsIdObj = mc.getMarkers() || [];
        locations = [];
        if(mc && googleMarkers.length > 0) {
            // mc.clearMarkers(googleMarkers);
            googleMarkers = [];
        }
        google.maps.event.addListener(map, 'click', function() {
            infobox.close();
        });
        for(let j=0; j<oldMarkers.length; j++ ) {
            oldMarkersLocationsIdObj[oldMarkers[j].locationId] = true
        }
        for (let i = 0; i < SLocation.length; i++) {
            let markerAlreadyExist = false;
            if(oldMarkersLocationsIdObj[SLocation[i]._id]) {
                markerAlreadyExist = true;

            }
            if(!markerAlreadyExist) {

                let latLng = new google.maps.LatLng(eval(SLocation[i].geoLat),eval(SLocation[i].geoLong));
                let marker = new google.maps.Marker({
                    position: latLng,
                    title: SLocation[i].title,
                    schoolId: SLocation[i].schoolId,
                    locationId: SLocation[i]._id,
                    map: map,
                    _id: SLocation[i]._id,
                });


                google.maps.event.addListener(marker, 'click', function() {
                    Meteor.call("getClassesForMap",{schoolId: SLocation[i].schoolId},(err,result)=> {
                        if(result) {
                            if(infobox) {
                                infobox.close();
                            }
                            infobox = new InfoBoxInstance(ibOptions);
                            infobox.setContent(infoSchool(result))
                            infobox.open(map, marker);
                            map.panTo(infobox.getPosition());
                        }
                    })
                });
                newMakers.push(marker);
            }
        }
        mc.addMarkers(newMakers)
        return
    }
}

function getSchoolViewOnMap(classTypes,backgroundUrl,schoolName) {
    let className = "";
    classTypes.forEach(data => {
        className +=  `<div class="info-box-classtype-name"><a href="">${data.name}</a></div>`
    })
    return (
        `<div id="info-box-wrap">
            <div style="height: 156px; margin: auto;">
                <img src=${backgroundUrl} style="width: 100%;height: 100%;">
            </div>
            <div style="padding-left:10px">
            <p style="font-size: 24px; font-weight: 300; font-family: 'Zilla Slab',serif;">${schoolName}</p>
            <p style="font-size: 18px; font-weight: 300; font-family: 'Zilla Slab',serif;">Class Types Available</p>
            </div>
            <div id="info-box-text-wrap">
                ${className}
            </div>
        </div>`
    )
}
