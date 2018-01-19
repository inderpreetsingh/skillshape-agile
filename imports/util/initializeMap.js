import React from 'react';
import Events from '/imports/util/events';
import ClassPricing from "/imports/api/classPricing/fields";
import { browserHistory } from 'react-router';
import ClassType from "/imports/api/classType/fields";
import {cutString} from '/imports/util';
import config from '/imports/config';
import { isEmpty } from 'lodash';
import { MarkerClusterer } from '/imports/ui/components/landing/components/jss/markerclusterer';

let mc;
let googleMarkers = [];
let locations = [];

let InfoBoxInstance;

const mapOptions = {
    zoom: 8,
    scrollwheel: true,
    minZoom: 1,
    center: { lat: -25.363, lng: 131.044 }
};

const ibOptions = {
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

let infobox;

function infoSchool({school, classTypes}) {
    if(school) {
        // console.log("<< --infoSchool -->>")
        let backgroundUrl = school.mainImage || "images/SkillShape-Whitesmoke.png";
        const schoolName = school ? cutString(school.name, 30) : "";
        Events.trigger("getSeletedSchoolData",{school});
        const view = getSchoolViewOnMap(classTypes, backgroundUrl, schoolName);
        return view;
    }
    return
}

export function createMarkersOnMap(mapId, locationData) {
    let map = new google.maps.Map(document.getElementById(mapId), {zoom: 5});
    let i = 0;
    for(let obj of locationData) {
        // console.log("createMarkersOnMap obj-->>",obj)
        if(obj.loc && obj.loc[0] && obj.loc[1]) {
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

export function reCenterMap(map, center) {
    // console.log("reCenterMap center -->>",center)
    map.panTo(new google.maps.LatLng(center[0], center[1]));
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
    import('/imports/ui/components/landing/components/jss/infoBox').then(InfoBox => {
        InfoBoxInstance = InfoBox.InfoBox;
        console.log("InfoBoxInfoBoxInfoBox", InfoBoxInstance)
    });
    if (document.getElementById('google-map')) {
        document.getElementById('google-map').innerHTML = ""
        let geolocate;
        let map = new google.maps.Map(document.getElementById('google-map'), mapOptions);

        geolocate = new google.maps.LatLng(center[0], center[1])
        map.setCenter(geolocate);
        // if (!!navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(function(position) {
        //         geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //         console.log("geolocate", geolocate);
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
            console.log("this", this)
            _.debounce(()=> {
                bounds = map.getBounds();
                NEPoint = [bounds.getNorthEast().lat(),bounds.getNorthEast().lng()];
                SWPoint = [bounds.getSouthWest().lat(),bounds.getSouthWest().lng()];
                browserHistory.push({
                  pathname: '',
                  search: `?zoom=${map.getZoom()}&SWPoint=${SWPoint}&NEPoint=${NEPoint}`
                })
            },countDebounce)();
            countDebounce = 3000;
        });
        return map;
    }
}

export function setMarkersOnMap(map, SLocation) {
    let previousLocation = [...locations];
    let newMakers = [];
    let deleteMakers = [];
    let infoBoxes = [];
    locations = [];
    if(mc && googleMarkers.length > 0) {
        // console.log("Old googleMarkers --->>",googleMarkers)
        // mc.clearMarkers(googleMarkers);
        googleMarkers = [];
    }
    google.maps.event.addListener(map, 'click', function() {
        infobox.close();
    });
    console.log("SLocation", SLocation);
    console.log("previousLocation", previousLocation);
    for (let i = 0; i < SLocation.length; i++) {

        let index = previousLocation.indexOf(SLocation[i]._id);
        if(index < 0) {

            let latLng = new google.maps.LatLng(eval(SLocation[i].geoLat),eval(SLocation[i].geoLong));
            let marker = new google.maps.Marker({
                position: latLng,
                title: SLocation[i].title,
                schoolId: SLocation[i].schoolId,
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
            googleMarkers.push(marker);
            newMakers.push(marker);
        }
        locations.push(SLocation[i]._id);
    }
    for(let j=0; j<googleMarkers.length; j++ ) {
        if(locations.indexOf(googleMarkers[j]._id) != -1) {
            console.log("deleteMakers", deleteMakers)
            deleteMakers.push(googleMarkers[j]);
        }
    }
    // console.log("deleteMakers --->>",deleteMakers);
    if(mc && deleteMakers.length > 0) {
        mc.clearMarkers(deleteMakers);
    }
    let mcOptions = {  maxZoom: 12 };
    if(mc) {
        mc.addMarkers(newMakers)
    } else {
        mc = new MarkerClusterer(map, newMakers, mcOptions);
    }
    console.log("before return");
    return
}

function getSchoolViewOnMap(classTypes,backgroundUrl,schoolName) {
    let className = "";
    classTypes.forEach(data => {
        console.log('data is as',data);
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
