// import { faker } from '@faker-js/faker'

// export const messages = Array.from({ length: 25 }, () => ({
//   id: faker.string.uuid(),
//   from: {
//     name: faker.person.fullName(),
//     email: faker.internet.email(),
//   },
//   subject: faker.lorem.sentence({ min: 6, max: 8 }),
//   date: new Date(faker.date.recent()),
//   body: faker.lorem.paragraphs({ min: 1, max: 2 }),
//   read: faker.datatype.boolean(),
// }))

export type Message = {
  id: string
  from: {
    name: string
    email: string
  }
  subject: string
  date: Date
  body: string
  read: boolean
}

export const messages: Message[] = [
  {
    id: 'c6c1a56b-f4e5-4405-8a0b-35a4002d2b72',
    from: {
      name: 'Hubert Bednar DDS',
      email: 'Zack.Rippin@hotmail.com',
    },
    subject: 'Recusandae adulatio modi cui templum ara vulpes.',
    date: new Date('2024-03-08T19:39:49.070Z'),
    body: 'Esse ea debeo cursim textus. Colligo bellicus pel ubi tepidus. Aeternus desino fugiat voveo alienus vicinus distinctio censura color totus.',
    read: true,
  },
  {
    id: 'ba287d13-1f5d-4b1c-87d3-acbc696cf806',
    from: {
      name: 'Ashley Lockman V',
      email: 'Kali_Walker@hotmail.com',
    },
    subject: 'Animi provident non canis celo sulum ducimus.',
    date: new Date('2024-03-08T14:53:16.589Z'),
    body: 'Universe alioqui ulterius tamisium. Tabernus depopulo communis tricesimus pauci. Xiphias volaticus infit.',
    read: false,
  },
  {
    id: '71153cce-a4bc-4d88-a2ca-e4a2f8dc0003',
    from: {
      name: 'Lucas Green',
      email: 'Annamarie9@yahoo.com',
    },
    subject: 'Summopere aeger curriculum velut claro sodalitas pauper.',
    date: new Date('2024-03-09T12:00:25.416Z'),
    body: 'Civis subito tremo creptio talio conturbo. Videlicet adduco atrocitas tametsi clam. Magni clibanus a solum amiculum delinquo clamo coadunatio angustus teneo.\nAegrotatio comprehendo et ancilla velum corrumpo defungo conduco catena vulgo. Tenuis suffragium comptus astrum aduro. Pax culpo bellicus.',
    read: true,
  },
  {
    id: '14d278d0-2cc0-4de7-93a3-5e91d702c620',
    from: {
      name: 'Julio Wintheiser',
      email: 'Gisselle.Shields33@hotmail.com',
    },
    subject: 'Conculco acidus talus trepide soluta vero.',
    date: new Date('2024-03-08T22:49:29.615Z'),
    body: 'Caritas argumentum tristis textus succedo. Subiungo verbum clamo tergum uterque amaritudo dens eum. Voveo stabilis adamo sponte avarus cogo.\nEarum confugo creptio adstringo utroque. Vergo sunt custodia tertius. Vito consectetur vulgaris compello sublime contabesco ambitus.',
    read: false,
  },
  {
    id: '70484279-99f3-442f-909b-5693a8c06531',
    from: {
      name: 'Carole Beahan',
      email: 'Jo_Davis9@hotmail.com',
    },
    subject: 'Conservo utrimque amoveo triduana similique stillicidium.',
    date: new Date('2024-03-08T18:43:14.427Z'),
    body: 'Aeneus thorax vulnus. Adhuc vilitas vulgus subseco amplus audeo terreo uxor quia teres. Conatus defaeco appello adsum et.\nVirga tandem colligo derelinquo careo. Denique agnosco vitium labore volubilis illo. Chirographum deficio vereor suppono utique velut vulnero error aedificium illum.',
    read: false,
  },
  {
    id: 'b7719755-3b3e-4c05-bca5-ae93ff07aa87',
    from: {
      name: 'Ms. Kara Feeney',
      email: 'Kiley48@gmail.com',
    },
    subject: 'Candidus deleo tergum deprecator caveo excepturi aeger.',
    date: new Date('2024-03-09T03:34:30.149Z'),
    body: 'Via animi conatus quo uberrime. Utilis unus cuius valens nostrum atrox calco ab argentum. Temperantia socius quo sui causa.\nVidelicet arma voluptas antiquus turpis spero succurro. Summopere comprehendo cilicium audax velociter aperiam. Virga cerno curis.',
    read: false,
  },
  {
    id: '3ebc5a6c-9809-4ac9-868e-e0b664263081',
    from: {
      name: 'Ethel Mueller',
      email: 'Arnold.Stehr@gmail.com',
    },
    subject: 'Talus callide color defluo demo torrens adimpleo demo.',
    date: new Date('2024-03-09T11:54:05.322Z'),
    body: 'Vilicus vindico collum animadverto dolorem umquam. Trans coaegresco textilis molestias deludo absconditus nostrum confero voco. Vilitas terra eos pax.',
    read: true,
  },
  {
    id: '3e0c7711-4017-4dab-b065-acb2348efa94',
    from: {
      name: 'Pearl Schultz',
      email: 'Ted74@gmail.com',
    },
    subject: 'Asperiores verto venia tripudio vigilo adicio.',
    date: new Date('2024-03-08T22:04:34.780Z'),
    body: 'Defetiscor vallum iure cribro sub spiritus amet aspernatur benigne volo. Sit bellum attero commodi depono volaticus debitis. Animadverto abbas tribuo.\nEarum uredo vorax. Sint summisse adopto conitor. Deprecator clamo perferendis.',
    read: true,
  },
  {
    id: '41cacb2b-b3a5-478f-a89c-b472857c4fad',
    from: {
      name: 'Debra Weber',
      email: 'Geo.Turner82@gmail.com',
    },
    subject: 'Exercitationem certe vilitas brevis tabgo adulescens.',
    date: new Date('2024-03-09T03:29:52.891Z'),
    body: 'Totus aiunt appono conforto. Caries cervus adstringo tempore. Convoco adimpleo ut cubo arbor asper.',
    read: true,
  },
  {
    id: 'f94a6069-34e3-42d1-95b3-18ac1cdf88df',
    from: {
      name: 'Della Hickle',
      email: 'Douglas.Smitham@yahoo.com',
    },
    subject: 'Crebro conqueror benevolentia bis victoria numquam quia vero.',
    date: new Date('2024-03-08T21:17:53.511Z'),
    body: 'Vox thymbra copia. Bellum suffoco veniam. Amo aggredior sulum alienus aspernatur denego.\nUllus victoria veritatis. Solitudo audax angustus cribro explicabo. Spoliatio aspicio alo clementia maxime solio supra.',
    read: false,
  },
  {
    id: 'e5d1a2a9-9459-4c90-a955-8ad2a313433f',
    from: {
      name: 'Maryann Turner',
      email: 'Donald8@hotmail.com',
    },
    subject: 'Nostrum desidero commemoro omnis antea aliquid nulla.',
    date: new Date('2024-03-08T16:38:18.224Z'),
    body: 'Vetus curso sed suadeo currus aduro alter. Spoliatio tempus tergum aliquam. Articulus umerus condico celer atrocitas degero volo.\nAger acerbitas fuga tui creptio repellat suscipio averto xiphias. Comes illo aranea vergo compello. Labore suffoco itaque nihil theologus.',
    read: true,
  },
  {
    id: 'e66a6fab-1f87-42cc-9524-c14db817c570',
    from: {
      name: 'Orlando Romaguera',
      email: 'Jessyca85@gmail.com',
    },
    subject: 'Vulgivagus quasi illo ascit contabesco textor desino ea.',
    date: new Date('2024-03-09T05:31:05.941Z'),
    body: 'Suadeo curiositas supra vix acer. Spectaculum timidus terminatio conturbo cauda. Stabilis aggredior vinum infit patrocinor tandem terreo tripudio curvo molestiae.\nIllum toties appositus degusto ademptio aduro usque. Tibi laboriosam aetas corroboro somnus. Damnatio vox depereo.',
    read: false,
  },
  {
    id: '554458d1-cf97-4eec-9279-d7709165f3da',
    from: {
      name: 'Victor Heaney-Botsford',
      email: 'Lillie_Reichel85@yahoo.com',
    },
    subject: 'Arcesso usitas beatae usitas ascit odio votum sopor.',
    date: new Date('2024-03-08T19:23:15.062Z'),
    body: 'Ante statua comminor atavus inventore caries ipsam quae arma vomer. Aurum verto reprehenderit thorax tam adhuc vulgo itaque a. Eveniet decet aperiam tripudio sollicito subseco explicabo.',
    read: false,
  },
  {
    id: '7b41126f-16b1-4d12-840f-ac9e502bc0b2',
    from: {
      name: 'Kelli Welch',
      email: 'Ezra40@gmail.com',
    },
    subject: 'Tenus aestivus ter quod ultio depraedor thesaurus angulus.',
    date: new Date('2024-03-09T03:56:56.238Z'),
    body: 'Comburo damno talio sub arto suadeo. Minus consequatur ver videlicet creptio accusator ventus vigor deleniti defessus. Ars vereor ambitus theologus virgo.\nAppono summa vel solitudo demum consectetur blandior. Verus eius deprimo. Traho dens molestias decens venustas.',
    read: true,
  },
  {
    id: '2df0bae6-e91e-457b-bcdd-394d9f1f150d',
    from: {
      name: 'Terrence Shanahan',
      email: 'Pete_Nader@gmail.com',
    },
    subject: 'Cunabula vinitor aggero antepono comptus comis.',
    date: new Date('2024-03-08T13:59:30.371Z'),
    body: 'Decet casus sapiente canonicus demulceo pauci deorsum sponte. Ultra arca desidero. Coepi blanditiis cogo crapula peccatus tertius.',
    read: false,
  },
  {
    id: '639c1072-fa8d-42e3-8d79-8f9c13b3d9e2',
    from: {
      name: 'Joshua Flatley',
      email: 'Marisol23@hotmail.com',
    },
    subject: 'Vero urbanus arx taceo defetiscor adiuvo adipiscor statim.',
    date: new Date('2024-03-09T01:27:20.408Z'),
    body: 'Explicabo vulgaris voluptatum. Acies vesica atque sperno. Tot desino excepturi comes angustus doloremque aureus aveho adiuvo.\nTot alveus venio vallum contra stillicidium. Vesco delego aegre conatus surgo tondeo dolorum. Comes deripio templum cado quam.',
    read: true,
  },
  {
    id: '04a1f2f7-86d8-4a3b-8091-f8f445971e86',
    from: {
      name: 'Dana Gleichner DVM',
      email: 'Ward50@hotmail.com',
    },
    subject: 'Casso voluntarius quam utilis aiunt commemoro appello acquiro.',
    date: new Date('2024-03-09T04:16:47.453Z'),
    body: 'Usitas incidunt calculus curis valetudo compono. Decet adnuo atavus solio. Circumvenio subvenio conspergo.',
    read: false,
  },
  {
    id: 'bde49f89-a8e8-411a-a132-3a7ec1e3fb2b',
    from: {
      name: 'Kevin Hand',
      email: 'Connie_Rohan@yahoo.com',
    },
    subject: 'Acidus speciosus ciminatio cur considero artificiose verbera.',
    date: new Date('2024-03-09T03:58:20.146Z'),
    body: 'Nemo tergeo vereor color templum vulgus comitatus. Absens defessus tremo turbo subseco pauper alii. Temperantia sit convoco.\nViscus natus odio tibi ambitus verto aeternus. Veritatis minima pel varius bellicus. Agnitio absorbeo veniam demum.',
    read: true,
  },
  {
    id: '32337d83-c96b-4b0b-9f5e-357136a5d3f2',
    from: {
      name: 'Ricardo Konopelski DDS',
      email: 'Marshall76@yahoo.com',
    },
    subject: 'Contra aperio subiungo tam vix tardus.',
    date: new Date('2024-03-09T07:54:29.357Z'),
    body: 'Aegrotatio sint subnecto atqui testimonium tabernus necessitatibus ars adversus. Delibero tero utpote demens cotidie crapula curto corroboro. Illo supellex inventore culpa ab veritatis officia exercitationem.',
    read: true,
  },
  {
    id: 'b253b7bd-5d21-40bd-a873-130299e6bf56',
    from: {
      name: 'Courtney Hodkiewicz',
      email: 'Brian.Klocko3@gmail.com',
    },
    subject: 'Altus acsi minima vacuus solio atrocitas compono voluptate.',
    date: new Date('2024-03-08T18:07:14.456Z'),
    body: 'Demonstro damno voluptate venustas amplus cotidie. Cupio testimonium tum apparatus cuppedia tepesco conor capitulus fugit. Ventito crustulum caries.',
    read: false,
  },
  {
    id: '2992be38-8687-4279-a385-350173385f44',
    from: {
      name: 'Roberto Rau',
      email: 'Cora.Schumm99@gmail.com',
    },
    subject: 'Constans facere temperantia coerceo ustulo cito.',
    date: new Date('2024-03-08T21:19:04.532Z'),
    body: 'Urbs cometes umquam cruciamentum carpo adsum. Aestas compello denuo cunctatio coadunatio corona. Tamquam cohibeo tabella caelum conatus acceptus turbo.',
    read: true,
  },
  {
    id: 'ada68516-7583-4deb-8f94-5dd378124c99',
    from: {
      name: 'Joey Schroeder-Effertz',
      email: 'Warren_Padberg@gmail.com',
    },
    subject: 'Absens tendo confero exercitationem earum abeo animus.',
    date: new Date('2024-03-09T11:10:38.399Z'),
    body: 'Aiunt coepi canto despecto abscido incidunt labore conscendo thema condico. Deporto deinde stillicidium tum solum carcer caterva. Abstergo carcer spiritus virgo antiquus cultellus suscipio dens depopulo autus.',
    read: false,
  },
  {
    id: '70609fc0-65a9-4d36-92ec-7a482fdd8c92',
    from: {
      name: 'Ms. Alison Daniel',
      email: 'Vicky_Ryan@gmail.com',
    },
    subject: 'Aequus laudantium coaegresco ater dedico articulus aliquid.',
    date: new Date('2024-03-08T18:50:11.049Z'),
    body: 'Tendo tui aveho vigilo. Ademptio quas tenetur defessus optio cetera. Ultra voluptatibus audentia bardus.\nCaveo textus copia nulla. Vapulus una adsidue vulgus officia contabesco aestas amplus. Balbus conspergo adstringo corporis libero tabula cura solio.',
    read: true,
  },
  {
    id: '941cfa1c-32f8-470d-8c78-0712c93d6e97',
    from: {
      name: 'Blanche Lubowitz',
      email: 'Viola.Ratke@yahoo.com',
    },
    subject: 'Tres volup tres adulescens tamisium vorax cedo.',
    date: new Date('2024-03-08T17:04:15.517Z'),
    body: 'Volutabrum doloremque thymbra sapiente. Delibero crudelis crux adeo incidunt. Abundans arx capio infit ascit.',
    read: true,
  },
  {
    id: '5a01e7a0-a8b2-4c1b-b630-af436ef587b8',
    from: {
      name: 'Jack Farrell',
      email: 'Coby.Daugherty25@gmail.com',
    },
    subject: 'Autus triumphus cresco molestias succedo aqua cinis.',
    date: new Date('2024-03-08T22:23:31.328Z'),
    body: 'Cur carcer comedo clibanus mollitia asper creptio atrocitas tenetur corroboro. Adhuc antepono taceo basium beatus. Audeo ademptio apostolus adversus carcer rerum confido voro vomito brevis.',
    read: false,
  },
]
