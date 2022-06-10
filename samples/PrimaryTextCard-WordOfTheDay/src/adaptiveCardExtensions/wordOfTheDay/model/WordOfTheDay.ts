export interface WordOfTheDay {
    _id:             string;
    word:            string;
    contentProvider: ContentProvider;
    definitions:     Definition[];
    publishDate:     string;
    examples:        Example[];
    pdd:             string;
    note:            string;
    htmlExtra:       null;
}

export interface ContentProvider {
    name: string;
    id:   number;
}

export interface Definition {
    source:       string;
    text:         string;
    note:         null;
    partOfSpeech: string;
}

export interface Example {
    url:   string;
    title: string;
    text:  string;
    id:    number;
}
