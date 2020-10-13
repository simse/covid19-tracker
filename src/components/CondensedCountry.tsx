import React from "react"
import { Link } from "react-router-dom"
import { IonIcon } from "@ionic/react"
import { arrowDown, arrowUp } from "ionicons/icons"
import "../styles/components/condensed-country.scss"

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
    subtitle?: string;
    iso?: string;
}

interface IProps {
    countryIso: string;
}
  
interface IState {
    countryIso: string;
    country: CountryData;
    loading: boolean;
}

class CondensedCountry extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        this.state = {
            countryIso: props.countryIso,
            loading: true,
            country: {}
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
                country: result,
                loading: false
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

    getCountryFlag() {
        if (this.state.countryIso) {
            return (
            <img
                src={require("../assets/flags/" + this.state.countryIso.toLowerCase() + ".svg")}
                className={"flag"}
                alt={"The flag of " + this.state.country.name}
            />
            )
        } else {
            return (
            <div className="flag"></div>
            )
        }
    }

    abbreviateNumber(value?: number) {
        if (!value) {
            return "0"
        }

        // var newValue = value;
        let formattedNumber: string = value.toString(2);

        if (value >= 1000) {
            var suffixes = ["", "K", "M", "B","T"];
            var suffixNum = Math.floor( (""+value).length/3 );
            var shortValue: number = 0;
            for (var precision = 2; precision >= 1; precision--) {
                shortValue = parseFloat( (suffixNum !== 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
                var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
                if (dotLessShortValue.length <= 2) { break; }
            }

            let stringNumber = shortValue.toFixed(1)

            if (shortValue % 1 !== 0)  stringNumber = shortValue.toFixed(1);
            formattedNumber = stringNumber + suffixes[suffixNum];
        }

        return formattedNumber;
    }

    getCountryCases() {
        let state = "good"
        let icon = arrowDown
        let casesCount = this.abbreviateNumber(this.state.country.total_cases)

        if (this.state.country.last_7_days_cases_trend && this.state.country.last_7_days_cases_trend > 0) {
            state = "bad"
            icon = arrowUp
        }

        return (
            <span className={"cases " + state}><IonIcon icon={icon} /> {casesCount} cases</span>
        )
    }

    render() {
        return (
            <Link to={"/countries/" + this.state.countryIso} style={{textDecoration: "none", color: "#fff"}}>
                <div className={"condensed-country"} >
                    <div className={"image"}>
                        { this.getCountryFlag() }
                    </div>

                    <div className={"meta"}>
                        <h3>{ this.state.country.name }</h3>

                        <div className="quick-stats">
                            { this.getCountryCases() }
                        </div>
                    </div>
                </div>
            </Link>
        )
    }
}

export default CondensedCountry