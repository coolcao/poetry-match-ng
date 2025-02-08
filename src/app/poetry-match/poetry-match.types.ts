export enum PoetryType {
  FiveCharacterOctave = '五言绝句', // 共四句，每句5字，共20字
  FiveCharacterLyushi = '五言律诗', // 共八句，每句5字，共40字
}
export interface Poetry {
  title: string;
  author: string;
  paragraphs: string[];
  desc: string;
  type: PoetryType;
  characters?: string[];
}

export interface CharacterCell {
  character: string;
  isOpened?: boolean; // 是否已翻开
  isPinned?: boolean; // 已组成句子的字，设置为固定
}
