import * as React from 'react';
import * as atlas from 'azure-maps-control';
import 'azure-maps-control/dist/atlas.min.css';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/fluent-light/theme.css";
import 'primeicons/primeicons.css';
//import { PanelMenu } from 'primereact/panelmenu';
import styles from './OfficeLocatorMap.module.scss';
import { useEffect, useRef } from 'react';
import { Tag } from 'primereact/tag';
import { Office } from '../../../types/main.types';
import { Toast } from 'primereact/toast';

export interface IOfficeLocatorMap {
    subscriptionKey: string;
    offices: Office[];
}

export const OfficeLocatorMap: React.FunctionComponent<IOfficeLocatorMap> = ({ subscriptionKey, offices }) => {
    const mapRef = useRef<HTMLDivElement | null>(null);
    const mapInstance = useRef<atlas.Map | null>(null);
    const toast = useRef<Toast>(null);

    const showSuccess = (message:string) => {
        if (toast?.current) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: message, life: 3000 });
        }
    }
    const copyToClipboard = (text: string): void => {
        navigator.clipboard.writeText(text).then(() => {
            showSuccess('Address copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    const updateMapPosition = (title: string): void => {
        const office = offices.find(office => office.title === title);
        if (office) {
            mapInstance.current?.setCamera({
                center: [office.lon, office.lat],
                zoom: 10
            });
        }
    };
   

    // const menuItems = [
    //     {
    //         label: 'Offices',
    //         icon: 'pi pi-map',
    //         items: offices.map(office => ({
    //             label: office.title,
    //             icon: 'pi pi-map-marker',
    //             command: () => updateMapPosition(office.title)
    //         }))
    //     }
    // ];

    useEffect(() => {
        if (mapRef.current && !mapInstance.current) {
            mapInstance.current = new atlas.Map(mapRef.current, {
                center: offices.length > 0 ? [offices[0].lon, offices[0].lat] : [0, 0],
                zoom: 5,
                view: 'Auto',
                authOptions: {
                    authType: atlas.AuthenticationType.subscriptionKey,
                    subscriptionKey: subscriptionKey,
                },
            });

            const popup = new atlas.Popup({ pixelOffset: [0, -30] });

            if (offices.length > 0) {
                offices.forEach((coordinate: Office) => {
                    const marker = new atlas.HtmlMarker({
                        color: 'DodgerBlue',
                        text: 'O',
                        position: [coordinate.lon, coordinate.lat]
                    });
                    mapInstance.current!.markers.add(marker);

                    mapInstance.current?.events.add('click', marker, () => {
                        popup.setOptions({
                            content: `
                                <div style="
                                    padding: 15px;
                                    font-family: Arial, sans-serif;
                                    color: #333;  
                                    display: flex;
                                    flex-direction: column;
                                    align-items: flex-start;
                                    flex-wrap: wrap;
                                    max-width: 200px;">
                                    <img src="${coordinate.image}" alt="${coordinate.title}" style="width: 100%; height: auto; border-radius: 8px; margin-bottom: 10px; max-width:200">
                                    <h1 style="font-size: 18px; margin: 0 0 5px;">${coordinate.title}</h1>
                                    <p style="font-size: 14px; margin: 0; white-space: break-spaces;">${coordinate.address}</p>
                                    <p style="color:#CB0084; font-size: 14px; margin: 0; white-space: break-spaces;">${coordinate.phone}</p>
                                    <p id="copyButton" style="cursor: pointer; font-size: 24px; margin:15px 0 15px -5px;">📑</p>
                                </div>
                            `,
                            position: [coordinate.lon, coordinate.lat],
                        });
                        popup.open(mapInstance.current!);

                        setTimeout(() => {
                            const copyButton = document.getElementById('copyButton');
                            copyButton?.addEventListener('click', () => copyToClipboard(`${coordinate.title}\n${coordinate.address}\n${coordinate.phone}`));
                        }, 0);
                    });
                });
            }
        }

        return () => {
            mapInstance.current?.dispose();
        };
    }, [subscriptionKey, offices]);

    return (
        <PrimeReactProvider>
            <div className={styles.officeLocatorMapContainer}>
                <Toast ref={toast} />
                <div className={styles.locationsTags}>
                    <Tag rounded className={styles.tag} onClick={() => updateMapPosition('London')} icon="pi pi-map-marker" value="LON"></Tag>
                    <Tag rounded className={styles.tag} onClick={() => updateMapPosition('Manchester')} icon="pi pi-map-marker" value="MAN"></Tag>
                    <Tag rounded className={styles.tag} onClick={() => updateMapPosition('Reading')} icon="pi pi-map-marker" value="RDG"></Tag>
                    <Tag rounded className={styles.tag} onClick={() => updateMapPosition('Milton Keynes')} icon="pi pi-map-marker" value="MK"></Tag>

                </div>
                <div ref={mapRef} style={{ height: '600px', width: '90%', margin: '25px 0' }} />
            </div>
        </PrimeReactProvider>
    );
};