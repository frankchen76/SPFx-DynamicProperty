declare interface IHeroWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'HeroWebPartStrings' {
  const strings: IHeroWebPartStrings;
  export = strings;
}
