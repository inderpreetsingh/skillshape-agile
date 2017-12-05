import ClassPricing from "/imports/api/classPricing/fields";
import { browserHistory } from 'react-router';
import ClassType from "/imports/api/classType/fields";
import {cutString} from '/imports/util';
import Events from '/imports/util/events';

let mc;
let googleMarkers = [];
let locations = [];

const mapOptions = {
    zoom: 15,
    scrollwheel: true,
    minZoom: 1,
    center: { lat: -25.363, lng: 131.044 }
};

function infoSchool({classType, school, skillClass}) {
    if(school && skillClass) {
        console.log("infoSchool classType -->>",classType)
        let backgroundUrl = school.mainImage || "images/SkillShape-Whitesmoke.png";
        const schoolName = school ? cutString(school.name, 20) : "";
        
        Events.trigger("getSeletedSchoolData",{classType, skillClass, school});
        const view = `<div id="content">
            <h3>${schoolName}</h3>
            <img src=${backgroundUrl} width="250" height="200">
        </div>`
        return view;
    }
    return
}

export function initializeMap() {
    if (document.getElementById('google-map')) {
        document.getElementById('google-map').innerHTML = ""
        let map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
        
        if (!!navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                let geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                console.log("geolocate", geolocate);
                map.setCenter(geolocate);
            });
        } else {
            map.setCenter(new google.maps.LatLng(52.3702, 4.8952));
        }

        google.maps.event.addListener(map, "bounds_changed", function() {
            _.debounce(()=> {
                bounds = map.getBounds();
                NEPoint = [bounds.getNorthEast().lat(),bounds.getNorthEast().lng()];
                SWPoint = [bounds.getSouthWest().lat(),bounds.getSouthWest().lng()];
                browserHistory.push({
                  pathname: '',
                  search: `?zoom=${map.getZoom()}&SWPoint=${SWPoint}&NEPoint=${NEPoint}`
                })
            },3000)();
        });
        return map;
    }
}

export function setMarkersOnMap(map, SLocation) {
    let previousLocation = [...locations];
    let newMakers = [];
    let deleteMakers = [];
    locations = [];

    console.log("before ", mc);
    if(mc && googleMarkers.length > 0) {
        console.log("Old googleMarkers --->>",googleMarkers)
        // mc.clearMarkers(googleMarkers);
        googleMarkers = [];
    }
    
    for (let i = 0; i < SLocation.length; i++) {
        locations.push(SLocation[i]._id);

        let index = previousLocation.indexOf(SLocation[i]._id);
        if(index > -1) {

        } else {

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
                        console.log("getClassesForMap result", result);
                        let infowindow = new google.maps.InfoWindow();
                        infowindow.setContent(infoSchool(result));
                        infowindow.open(map, marker);
                    }
                })
            });
            googleMarkers.push(marker);
            newMakers.push(marker);
        }
    }

    for(let j=0; j<googleMarkers.length; j++ ) {
        if(locations.indexOf(googleMarkers[j]._id) != -1) {
            deleteMakers.push(googleMarkers[j]);
        }
    }
    console.log("deleteMakers --->>",deleteMakers);
    if(mc && deleteMakers.length > 0) {
        mc.clearMarkers(deleteMakers);
    }
    let mcOptions = {  maxZoom: 12 };
    if(mc) {
        mc.addMarkers(newMakers)
    } else {
        mc = new MarkerClusterer(map, newMakers, mcOptions);
    }

    return
}