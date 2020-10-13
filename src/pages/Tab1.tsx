import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon } from '@ionic/react';
import { arrowUpOutline, arrowDownOutline } from 'ionicons/icons';

import CondensedCountry from "../components/CondensedCountry"

import './Tab1.scss';

interface IProps {}

interface IState {
  globalCases: number;
  globalDeaths: number;
  globalCaseTrend: number;
  globalDeathTrend: number;
}

class Tab1 extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      globalCases: 0,
      globalDeaths: 0,
      globalCaseTrend: 0,
      globalDeathTrend: 0
    }
  }

  componentDidMount() {
    fetch("https://api.avoidthe.icu/worldwide.json")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            globalCases: result.global_cases,
            globalDeaths: result.global_deaths,
            globalCaseTrend: result.global_case_trend,
            globalDeathTrend: result.global_death_trend
          })
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        () => {
          //this.setLoadingState(false)
        }
      )
  }

  formatTrend(trend?: number) {
    if (trend) {
      trend = Math.round(trend * 100) / 100

      if (trend > 0) {
        return (
          <div className={"trend bad"}>
            <IonIcon icon={arrowUpOutline} /> <span>+{trend}%</span>
          </div>
        )
      } else {
        return (
          <div className={"trend good"}>
            <IonIcon icon={arrowDownOutline} /> <span>{trend}%</span>
          </div>
        )
      }
    }
  }

  formatNumber(num: number) {
    return Math.round(num / 10000) / 100 + "M"
  }

  getFavorites() {
    let favoritedCountries = localStorage.getItem("favorited_countries")
    if (favoritedCountries) {
      let favCountriesJson: Array<string> = JSON.parse(favoritedCountries)

      if (favCountriesJson.length > 0) {
        return favCountriesJson.map(countryIso => (
          <>
            <CondensedCountry countryIso={countryIso} key={countryIso} />
          </>
        ))
      }      
    }

    return (<p className="no-favorites">No favorited countries yet</p>)
  }

  render() {
    return (
      <IonPage className={"dashboard"}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Dashboard</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Dashboard</IonTitle>
            </IonToolbar>
          </IonHeader>
          
          <div className={"padding"}>
            <h3 className={"section-title"}>Worldwide statistics</h3>
  
            <div className={"stats"}>
              {this.formatTrend(this.state.globalCaseTrend)}
  
              <h1>{ this.formatNumber(this.state.globalCases) }</h1>
              <span>confirmed cases of COVID-19</span>
            </div>
  
            <div className={"stats"}>
            {this.formatTrend(this.state.globalDeathTrend)}
  
              <h1>{ this.formatNumber(this.state.globalDeaths) }</h1>
              <span>deaths related to COVID-19</span>
            </div>
          </div>

          <div className={"padding"}>
            <h3 className={"section-title"}>Your favorites</h3>

            {this.getFavorites()}
          </div>
        </IonContent>
      </IonPage>
    );
  }
}

export default Tab1;
