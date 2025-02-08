import { Poetry, PoetryType } from "./poetry-match.types";

const poetryList: Poetry[] = [
  {
    title: '静夜思',
    author: '李白',
    paragraphs: [
      '床前明月光', '疑是地上霜',
      '举头望明月', '低头思故乡',
    ],
    desc: '《静夜思》是一首五言诗，此诗描写了旅居在外的诗人于秋日夜晚在屋内抬头望月而思念家乡的感受。前两句写诗人在作客他乡的特定环境中一刹那间所产生的错觉；后两句通过动作神态的刻画，深化主人公的思乡之情。全诗没有奇特新颖的想象，没有精工华美的辞藻，只是用叙述的语气，采取比喻、衬托等手法，表达客居思乡之情，语言清新朴素而韵味含蓄无穷，历来广为传诵。',
    type: PoetryType.FiveCharacterOctave,
  }
];

export const getPoetryList = () => {
  return poetryList.map(poetry => {
    return {
      ...poetry,
      characters: poetry.paragraphs.join('').split('').sort(() => Math.random() - 0.5),
    }
  });
}
