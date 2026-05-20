import { uniqueNamesGenerator, adjectives, animals, colors } from 'unique-names-generator';

export const generateRandomName = (): string => {
const shortName = uniqueNamesGenerator({
  dictionaries: [adjectives, colors, animals], // colors can be omitted here as not used
  length: 3,
  separator:' '
});

return shortName;
}