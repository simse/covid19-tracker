import React from 'react';
import { match } from "react-router-dom";
import { IonContent, IonHeader, IonPage, IonToolbar, IonButtons, IonBackButton, IonIcon, IonSegment, IonSegmentButton, IonLabel, IonSkeletonText } from '@ionic/react';
import { arrowUpOutline, arrowDownOutline } from 'ionicons/icons';
import "../styles/country.scss";
import Chart from 'chart.js';

interface CountryParams {
  id: string;
}

interface IProps {
  required: string;
  match?: match<CountryParams>
}

interface IState {
  countryIso: string;
  country: CountryData;
  view: string;
  loading: boolean;
}

interface CountryParent {
  name?: string;
  formal_name?: string;
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
  graph_cases?: Array<number>;
  graph_deaths?: Array<number>;
  name?: string;
  formal_name?: string;
  parent?: CountryParent;
  iso?: string;
}

interface GraphPoint {
  x: number;
  y: number;
}

class Country extends React.Component<IProps, IState> {
  private allCasesGraph: React.RefObject<HTMLCanvasElement>;
  private allDeathsGraph: React.RefObject<HTMLCanvasElement>;
  private pastMonthCasesGraph: React.RefObject<HTMLCanvasElement>;
  private pastMonthDeathsGraph: React.RefObject<HTMLCanvasElement>;


  constructor(props: IProps) {
    super(props)

    if (props) {
      if (props.match) {
        this.state = {
          view: "statistics",
          countryIso: props.match.params.id,
          country: {},
          loading: true
        }
      }
    }

    this.allCasesGraph = React.createRef();
    this.allDeathsGraph = React.createRef();
    this.pastMonthCasesGraph = React.createRef();
    this.pastMonthDeathsGraph = React.createRef();
  }

  componentDidMount() {
    let url = "https://api.avoidthe.icu/summary/" + this.state.countryIso + ".json";
    fetch(url)
      .then(res => res.json())
      .then(
        (result) => {
          //this.setLoadingState(true)
          this.setState({
            country: result,
            loading: false
          })

          this.drawAllGraphs()
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        () => {
          //this.setLoadingState(false)
        }
      )

    Chart.defaults.global.defaultFontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
  }

  drawGraph(ref: React.RefObject<HTMLCanvasElement>, color: string, data?: Array<GraphPoint>) {
    if (ref.current) {
      new Chart(ref.current, {
        type: 'scatter',
        data: {
          labels: [],
          datasets: [{
            showLine: true,
            data: data,
            borderWidth: 2,
            borderColor: color,
            pointRadius: 0
          }]
        },
        options: {
          legend: {
            display: false
          },
          tooltips: {
            enabled: false
          },
          scales: {
            xAxes: [{
              ticks: {
                display: false
              }
            }]
          }
        }
      });
    }
  }

  drawAllGraphs() {
    this.drawGraph(this.allCasesGraph, "#3880ff", this.getTotalCasesGraph())
    this.drawGraph(this.allDeathsGraph, "#eb445a", this.getTotalDeathsGraph())
    this.drawGraph(this.pastMonthCasesGraph, "#3880ff", this.getCasesPastMonthGraph())
    this.drawGraph(this.pastMonthDeathsGraph, "#eb445a", this.getDeathsPastMonthGraph())
  }

  generateGraphDataset(data: number[]) {
    let i = 1;
    let graph = Array<GraphPoint>();

    data.forEach(element => {
      if (element === 0) return;

      graph.push({
        x: i,
        y: element
      })

      i++;
    });

    return graph;
  }

  intervalDataSet(dataset: number[], interval: number) {
    let finalDataSet: number[] = []
    let filteredDataSet = dataset.filter(point => {
      return point > 0
    })

    let i = 1

    filteredDataSet.forEach(point => {
      if (i % interval === 0) {
        finalDataSet.push(point)
      }

      i++
    })

    return finalDataSet
  }

  getTotalCasesGraph() {
    if(this.state.country.graph_cases && this.state.country.total_cases) {
      let interval = 4;

      if (this.state.country.total_cases < 1000) {
        interval = 1
      }

      return this.generateGraphDataset(this.intervalDataSet(this.state.country.graph_cases, interval))
    }
  }

  getTotalDeathsGraph() {
    if(this.state.country.graph_deaths) {
      return this.generateGraphDataset(this.intervalDataSet(this.state.country.graph_deaths, 5))
    }
  }

  getCasesPastMonthGraph() {
    if(this.state.country.graph_cases) {
      let pastMonth = this.state.country.graph_cases.slice(Math.max(this.state.country.graph_cases.length - 30, 0))

      return this.generateGraphDataset(pastMonth)
    }
  }

  getDeathsPastMonthGraph() {
    if(this.state.country.graph_deaths) {
      let pastMonth = this.state.country.graph_deaths.slice(Math.max(this.state.country.graph_deaths.length - 30, 0))

      return this.generateGraphDataset(pastMonth)
    }
  }

  setView(view?: string) {
    if (view) {
      this.setState({
        view: view
      })

      if (view === "graphs") {
        this.drawAllGraphs()
      }
    }
  }

  getCountryFlag(iso?: string) {
    if (iso) {
      return require("../assets/flags/" + iso.toLowerCase() + ".svg")
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

  formatNumber(number?: number) {
    if (number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return 0
    }
  }

  showParent() {
    if (this.state.country.parent?.formal_name) {
      return (
        <span className="parent">Part of {this.state.country.parent.formal_name}</span>
      )
    } else if(this.state.country.parent?.name) {
      return (
        <span className="parent">Part of {this.state.country.parent.name}</span>
      )
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
              src={this.getCountryFlag(this.state.country.iso)}
              className={"flag"}
              alt={"The flag of " + this.state.country.name}
            />
            {this.state.loading && <IonSkeletonText animated></IonSkeletonText>}
            {!this.state.loading && <h2>{this.state.country.name}</h2>}
            {this.showParent()}
          </div>

          <div className={"selector"}>
            <IonSegment onIonChange={e => this.setView(e.detail.value)} value={this.state.view}>
              <IonSegmentButton value="statistics">
                <IonLabel>Statistics</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="graphs">
                <IonLabel>Graphs</IonLabel>
              </IonSegmentButton>
            </IonSegment>
          </div>

          {this.state.view === "statistics" && <div className={"view statistics"}>
            <h3 className={"section-title"}>Total statistics</h3>
            <div className={"stats"}>
              <div className={"cases"}>

                {this.formatTrend(this.state.country.last_7_days_cases_trend)}
                <h1>{this.formatNumber(this.state.country.total_cases)}</h1>
                <span>Total COVID-19 cases</span>

              </div>

              <div className={"deaths"}>

                {this.formatTrend(this.state.country.last_7_days_deaths_trend)}
                <h1>{this.formatNumber(this.state.country.total_deaths)}</h1>
                <span>Total COVID-19 related deaths</span>

              </div>
            </div>

            <h3 className={"section-title"}>Last 7 days</h3>
            <div className={"stats"}>
              <div className={"cases"}>

                <h1>{this.formatNumber(this.state.country.last_7_days_cases)}</h1>
                <span>COVID-19 cases in the past week</span>

              </div>

              <div className={"deaths"}>

                <h1>{this.formatNumber(this.state.country.last_7_days_deaths)}</h1>
                <span>COVID-19 related deaths in the past week</span>

              </div>
            </div>
          </div>}

          {this.state.view === "graphs" && <div className={"view graphs"}>
            <h3 className={"section-title"}>All cases</h3>
            <canvas ref={this.allCasesGraph} />

            <h3 className={"section-title"}>All COVID-19 related deaths</h3>
            <canvas ref={this.allDeathsGraph} />

            <h3 className={"section-title"}>Cases past 30 days</h3>
            <canvas ref={this.pastMonthCasesGraph} />

            <h3 className={"section-title"}>COVID-19 related deaths past 30 days</h3>
            <canvas ref={this.pastMonthDeathsGraph} />
          </div>}
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
