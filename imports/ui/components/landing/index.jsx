import React, {Component} from 'react';
import styled from 'styled-components';
import {Element, scroller } from 'react-scroll'

import Cover from './components/Cover.jsx';
import BrandBar from './components/BrandBar.jsx';
import SearchArea from './components/SearchArea.jsx';
import CardsList from './components/cards/CardsList.jsx';
import ClassMap from './components/map/ClassMap.jsx';
import FilterPanel from './components/FilterPanel.jsx';
import SwitchIconButton from './components/buttons/SwitchIconButton.jsx';
import Footer from './components/footer/index.jsx';

import * as helpers from './components/jss/helpers.js';
import { cardsData, cardsData1} from './constants/cardsData.js';

const MainContentWrapper = styled.div`
  display: flex;
`;

const FilterBarWrapper = styled.div`
  width: calc(20% - 20px);
  margin: 10px;
`;

// const CardsDisplaySectionWrapper = styled.section`
//   width: calc(100% - ${helpers.rhythmDiv}px);
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;

//   @media screen and (min-width : 0) and (max-width: ${helpers.tablet}px) {
//     width: 100%;
//   }
// `;

const MapContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const CardsContainer = styled.div`
  width: 100%;
`;

const SwitchViewWrapper = styled.div`
  padding: ${helpers.rhythmDiv}px;
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 20;
`;

class Landing extends Component {
    state = {
      mapView: false,
      cardsDataList : [cardsData,cardsData1]
    }
    toggleMapView = () => {
      this.setState({
        mapView: !this.state.mapView
      });

      this.scrollTo();
    }
    scrollTo(name) {
      scroller.scrollTo(('content-container'|| name),{
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart'
      })
    }
    render() {
        return(
            <main>
                <header>
                    <BrandBar/>
                    <Cover>  <SearchArea /> </Cover>
                </header>

                 <FilterPanel />

                 <Element name="content-container" className="element">
                  <MainContentWrapper>
                    {this.state.mapView ?
                      (
                        <MapContainer>
                            <ClassMap isMarkerShown />
                        </MapContainer>

                      ) :
                    (<CardsContainer>
                        <CardsList mapView={this.state.mapView} title={'Yoga in Delhi'} name={'yoga-in-delhi'} cardsData={this.state.cardsDataList[0]} />
                        <CardsList mapView={this.state.mapView} title={'Painting in Paris'} name={'painting-in-paris'} cardsData={this.state.cardsDataList[1]} />
                    </CardsContainer>)}
                  </MainContentWrapper>
                </Element>
                <SwitchViewWrapper>
                  <SwitchIconButton onClick={this.toggleMapView}/>
                </SwitchViewWrapper>

                <Footer />
            </main>
        )
    }
}


export default Landing;
