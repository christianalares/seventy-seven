export function randomInt(...args: [number] | [number, number] | []) {
  switch (args.length) {
    // If one argument generate between 0 and args[0]
    case 1:
      return Math.floor(Math.random() * (args[0] + 1))

    // If two arguments generate between args[0] and args[1]
    case 2:
      return Math.floor(Math.random() * (args[1] - args[0] + 1)) + args[0]

    // Otherwise generate between 0 and 1
    default:
      return Math.random()
  }
}

export const fakeEmails = [
  'elenora_moen@hotmail.com',
  'nedra.jenkins@gmail.com',
  'lulu42@yahoo.com',
  'kay.nienow40@hotmail.com',
  'thalia7@gmail.com',
  'clint52@hotmail.com',
  'jennie54@gmail.com',
  'gardner.smitham@yahoo.com',
  'juvenal.mante65@hotmail.com',
  'alfreda.marquardt80@gmail.com',
  'kim_collins16@gmail.com',
  'scottie_lind@gmail.com',
  'jadon17@gmail.com',
  'london.bayer@yahoo.com',
  'elta_medhurst85@hotmail.com',
  'maxwell27@hotmail.com',
  'shad50@gmail.com',
  'alfonzo_kuphal@yahoo.com',
  'kenneth_weissnat@gmail.com',
  'angelica_kuhlman-bayer@hotmail.com',
  'terrell_zulauf@hotmail.com',
  'rigoberto1@gmail.com',
  'kaci95@yahoo.com',
  'gillian46@yahoo.com',
  'alia.heaney@gmail.com',
  'shanon91@gmail.com',
  'cecelia.kshlerin@yahoo.com',
  'emmie_reinger@gmail.com',
  'kayla86@hotmail.com',
  'yadira_russel2@hotmail.com',
  'reta.schmitt32@yahoo.com',
  'maryam.rodriguez7@yahoo.com',
  'susana_moen@gmail.com',
  'lavern_berge7@hotmail.com',
  'sven.wisoky54@gmail.com',
  'adrien66@hotmail.com',
  'jeanie75@gmail.com',
  'loma_runte@hotmail.com',
  'samir.zemlak@gmail.com',
  'johann.osinski@gmail.com',
  'buster.marks49@hotmail.com',
  'jensen_glover7@gmail.com',
  'jamarcus_beer@yahoo.com',
  'willa.schmitt69@hotmail.com',
  'mason_wiegand@yahoo.com',
  'rafael19@yahoo.com',
  'nickolas.durgan@gmail.com',
  'narciso_bogan@gmail.com',
  'deontae_littel51@gmail.com',
  'larry26@yahoo.com',
  'osvaldo.emard@yahoo.com',
  'royal_kris46@yahoo.com',
  'enrico.hamill@yahoo.com',
  'mckenna_ullrich@gmail.com',
  'stevie.leuschke72@gmail.com',
  'herbert60@hotmail.com',
  'marcus23@gmail.com',
  'odie.carroll88@hotmail.com',
  'oleta76@hotmail.com',
  'natalia_konopelski26@yahoo.com',
  'lilian12@hotmail.com',
  'brooke_rempel76@gmail.com',
  'mitchel_brown@yahoo.com',
  'hailey.ohara@gmail.com',
  'thea57@gmail.com',
  'jack76@gmail.com',
  'aric_johnson@gmail.com',
  'asia.bogisich@yahoo.com',
  'morton81@gmail.com',
  'ferne4@gmail.com',
  'katelynn_rodriguez@gmail.com',
  'kailyn_streich@yahoo.com',
  'jefferey_padberg@yahoo.com',
  'emma_hamill@gmail.com',
  'kendra.greenfelder48@yahoo.com',
  'taylor61@yahoo.com',
  'trent_ward@gmail.com',
  'merl.bashirian5@hotmail.com',
  'lucas94@hotmail.com',
  'laurel37@hotmail.com',
  'isobel1@yahoo.com',
  'nasir_hoppe-runolfsson@gmail.com',
  'mckenzie.wunsch@gmail.com',
]

export const getFakeEmail = (index?: number) => {
  if (index === undefined) {
    return fakeEmails[randomInt(0, fakeEmails.length - 1)]!
  }

  return fakeEmails[index]!
}
