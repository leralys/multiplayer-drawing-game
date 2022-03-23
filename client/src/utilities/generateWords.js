import { generateSlug } from 'random-word-slugs';

export const categories = {
    easy: { words: 'food', points: 1 },
    medium: { words: 'animals', points: 3 },
    hard: { words: 'education', points: 5 }
}

class Word {
    constructor(word, points) {
        this.word = word;
        this.points = points;
    }
}

export const generateWord = category => {
    const word = generateSlug(1, {
        partsOfSpeech: ['noun'],
        categories: {
            noun: [`${category.words}`]
        }
    });
    return new Word(word, category.points);
}
