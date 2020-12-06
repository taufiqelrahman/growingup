const generatePsdScript = ({ gender, age, hair, skin, language }) => `const child = {
  gender: '${gender}',
  age: '${age}',
  hair: '${hair}',
  skin: '${skin}',
  language: '${language}'
}

/**
 * Change avatar
 */
const avatar = app.activeDocument.layerSets.getByName('Avatar')
avatar.visible = true;

const gender = avatar.layers.getByName(child.gender);
gender.visible = true;

const age = gender.layers.getByName(child.age);
age.visible = true;

const hair = age.layers.getByName(child.hair);
hair.visible = true;

const skin = hair.layers.getByName(child.skin);
skin.visible = true;

for (var i = 0; i < skin.layers.length; i++) {
  skin.layers[i].visible = true;
}
`;

export default generatePsdScript;
