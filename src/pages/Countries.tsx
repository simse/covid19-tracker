import React from 'react';
import { RouteComponentProps } from "react-router-dom";
import { Route } from "react-router-dom";
import { IonRouterOutlet } from '@ionic/react';

// Pages
import CountryList from "./CountryList";
import Country from "./Country";




const Countries: React.FC<RouteComponentProps> = ({ match }) => {
  return (
    <IonRouterOutlet>
      <Route exact path={match.url} component={CountryList} />
      <Route path={`${match.url}/:id`} component={Country} />
    </IonRouterOutlet>
  );
};

export default Countries;
