export const normilizeText = text => {
  const normalized = text
    .replace(/[^\w\s]/gi, '')
    .toLowerCase()
    .trim();
  const joined = normalized.split(' ').join('');
  return joined;
};

export const properCase = text => {
  function upperCase(str) {
    return str.toUpperCase();
  }
  return text.toLowerCase().replace(/^\w|\s\w/g, upperCase);
};

export const concatTrimmed = text => {
  const trimmed = properCase(text)
    .split(' ')
    .map(word => word.trim());
  const noSpaces = trimmed.filter(el => el !== '');
  const joined = noSpaces.join(' ');

  return joined;
};

export const checkDuplicate = (array, property, string) => {
  const isDuplicate = array.some(
    arrVal => normilizeText(string) === normilizeText(arrVal[property])
  );
  return isDuplicate;
};
export const checkCycle = (array, property, domain) => {
  const isCycle = array.some(
    arrVal => normilizeText(domain) === normilizeText(arrVal[property])
  );
  return isCycle;
};
export const checkValidation = (
  dictionary,
  addSynonim,
  handleValidatedDialog
) => {
  const validate = dictionary.filter(el => {
    const { isDuplicate, isFork, isCycle, isChain, domain, range } = el;
    if (isDuplicate || isFork || isCycle || isChain || !domain || !range)
      return true;
    return false;
  });
  if (validate.length === 0) {
    addSynonim(true);
  } else {
    handleValidatedDialog();
    addSynonim(false);
  }
};

export function validateDictionary(synonims) {
  // Duplicate Domains / Ranges: Two rows in the dictionary map to the same value, simply resulting in duplicate content.
  // Forks or Duplicate Domains with different Ranges: Two rows in the dictionary map to different values, resulting in an ambiguous transformation.
  // Cycles: Two or more rows in a dictionary result in cycles, resulting in a never - ending transformation.
  // Chains: A chain structure in the dictionary (a value in Range column also appears in Domain column of another entry), resulting in inconsistent transformation.
  const validatedDictionary = synonims.map(synonim => {
    const { domain, range } = synonim;
    const newArr = synonims.filter(el => el !== synonim);
    let newSynonim;

    const isDuplicateDomain = checkDuplicate(newArr, 'domain', domain);

    const isDuplicateRange = checkDuplicate(newArr, 'range', range);

    const isDuplicate = isDuplicateDomain && isDuplicateRange;
    newSynonim = { ...synonim, isDuplicate };

    const isFork = checkDuplicate(newArr, 'domain', domain);

    newSynonim = { ...newSynonim, isFork };

    const isCycle = checkCycle(newArr, 'range', domain);

    newSynonim = { ...newSynonim, isCycle };

    const isChain = checkCycle(newArr, 'domain', range);
    newSynonim = { ...newSynonim, isChain };

    return newSynonim;
  });
  return validatedDictionary;
}
