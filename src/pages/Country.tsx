import React from 'react';
import { match } from "react-router-dom";
import { IonContent, IonHeader, IonPage, IonToolbar, IonButtons, IonBackButton, IonIcon } from '@ionic/react';
import { arrowUpOutline, arrowDownOutline } from 'ionicons/icons';
import "../styles/country.scss";
//import { RouteComponentProps } from 'react-router';

interface CountryParams {
  id: string;
}

interface IProps  {
  required: string;
  match?: match<CountryParams>
}

interface IState {
  countryIso: string;
  country: CountryData;
}

interface CountryData {
  total_cases?: number;
  total_deaths?: number;
  source?: string;
  last_update?: string;
  last_7_days_cases?: number;
  last_7_days_deaths?: number;
  last_7_days_cases_trend?: number;
  last_7_days_deaths_trend?: number;
  graph_beginning?: string;
  cases_graph?: Array<number>;
  deaths_graph?: Array<number>;
  country_name?: string;
  country_code?: string;
}

class Country extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    if (props) {
      if (props.match) {
        this.state = {
          countryIso: props.match.params.id,
          country: {}
        }
      }
    }
  }

  componentDidMount() {
    let url = "https://api.avoidthe.icu/summary/" + this.state.countryIso + ".json";
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          //this.setLoadingState(true)
          this.setState({
            country: result
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

  getCountryFlag(iso?: string) {
    if (iso) {
      return require("../assets/flags/" + iso + ".svg")
    } else {
      return require("../assets/flags/dk.svg")
    }
  }

  formatTrend(trend?: number) {
    if (trend) {
      trend = Math.round(trend * 100) / 100

      if (trend > 0) {
        return (
          <div className={"trend bad"}>
            <IonIcon icon={arrowUpOutline} /> <span>+{ trend }%</span>
          </div>
        )
      } else {
        return (
          <div className={"trend good"}>
            <IonIcon icon={arrowDownOutline} /> <span>{ trend }%</span>
          </div>
        )
      }
    }
  }

  formatNumber(number?: number) {
    if (number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return 0
    }
  }

  render() {
    return (
      <IonPage className={"country"}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton />
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
  

          <div className={"header"}>
            <img 
              src={this.getCountryFlag(this.state.country.country_code)}
              className={"flag"}
              alt={"The flag of " + this.state.country.country_name} 
            />

            <h2>{ this.state.country.country_name }</h2>
          </div>

          <h3 className={"section-title"}>Total statistics</h3>
          <div className={"stats"}>
            <div className={"cases"}>

              {this.formatTrend(this.state.country.last_7_days_cases_trend)}
              <h1>{ this.formatNumber(this.state.country.total_cases) }</h1>
              <span>Total COVID-19 cases</span>

            </div>

            <div className={"deaths"}>

              {this.formatTrend(this.state.country.last_7_days_deaths_trend)}
              <h1>{ this.formatNumber(this.state.country.total_deaths) }</h1>
              <span>Total COVID-19 related deaths</span>

            </div>
          </div>

          <h3 className={"section-title"}>Last 7 days</h3>
          <div className={"stats"}>
            <div className={"cases"}>

              <h1>{ this.formatNumber(this.state.country.last_7_days_cases) }</h1>
              <span>COVID-19 cases in the past week</span>

            </div>

            <div className={"deaths"}>

              <h1>{ this.formatNumber(this.state.country.last_7_days_deaths) }</h1>
              <span>COVID-19 related deaths in the past week</span>

            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }
}
/*
const Country: React.FC<CountryPageProps> = ({match}) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>

          <IonTitle>Country</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>

        {match.params.id}
      </IonContent>
    </IonPage>
  );
};*/

export default Country;
