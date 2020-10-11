import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonChip, IonLabel, IonIcon } from '@ionic/react';
import { arrowUpOutline } from 'ionicons/icons';
import './Tab1.css';

const Tab1: React.FC = () => {
  return (
    <IonPage>
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

          <IonChip outline={true}>
            <IonLabel color="default" >Cases</IonLabel>
          </IonChip>

          <IonChip>
            <IonLabel color="danger">Deaths</IonLabel>
          </IonChip>

          <div className={"stats"}>
            <div className={"trend"}>
              <IonIcon icon={arrowUpOutline} /> <span>+4.2%</span>
            </div>

            <h1>1.07M</h1>
            <span>deaths related to COVID-19</span>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
