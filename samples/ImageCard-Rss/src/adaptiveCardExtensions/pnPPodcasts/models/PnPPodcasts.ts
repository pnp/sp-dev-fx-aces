export interface PnPPodcasts {
    channel: Channel;
}
export interface Channel {
    title: string;
    link: string;
    image: Image;
    item?: (ItemEntity)[] | undefined;
}
export interface Image {
    url: string;
}
export interface ItemEntity {
    title: string;
    link: string;
    description: string;
    subtitle: string;
    summary: string;
    duration: string;
    episode: string;
    enclosure: string;
    image: string;
}
