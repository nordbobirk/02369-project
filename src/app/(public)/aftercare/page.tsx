import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";

export default function Aftercare() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-8 text-center">
            Aftercare
          </h1>
          <p className="text-lg text-center mb-12 text-left">
            Den rigtige aftercare er vigtig for heling og vedligeholdelse af
            kvaliteten af din nye tatovering. Følg nedenstående instruktioner
            for at opnå de bedste resultater.
          </p>

          {/* Tidslinje */}
          <div className="bg-black/80 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="h-6 w-6 text-red-500" />
              Healing Tidslinje
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-6">
                <h3 className="text-lg font-semibold text-white">
                  Dag 1-3: Initial heling
                </h3>
                <p className="text-slate-100">
                  Behold forbindingen i 2-4 timer, vask derefter forsigtigt og
                  påfør et tyndt lag salve.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-6">
                <h3 className="text-lg font-semibold text-white">
                  Dag 4-14: Afningsfase
                </h3>
                <p className="text-slate-100">
                  Huden begynder at skalle og flage. Pil eller krads ikke. Skift
                  til parfume-fri lotion.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-6">
                <h3 className="text-lg font-semibold text-white">
                  Dag 15-30: Endelig heling
                </h3>
                <p className="text-slate-100">
                  Fortsæt med at fugte huden. Tatoveringen kan se en smule mat
                  ud – det er normalt.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Gør */}
            <div className="bg-black/80 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                GØR
              </h2>
              <ul className="space-y-3 text-slate-100">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Vask dine hænder før du rører ved din tatovering</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Vask forsigtigt med antibakteriel sæbe 2-3 gange dagligt
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Tør med et rent papirhåndklæde</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Påfør et tyndt lag anbefalet salve</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Hold tatoveringen fugtig men ikke gennemblødt</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Brug løst og åndbart tøj</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Sov i rene lagner</span>
                </li>
              </ul>
            </div>

            {/* Gør ikke */}
            <div className="bg-black/80 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <XCircle className="h-6 w-6 text-red-500" />
                GØR IKKE
              </h2>
              <ul className="space-y-3 text-slate-100">
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Pil, krads eller skræl ikke tatoveringen</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Tag ikke karbad, og undgå svømmebassiner og spabade
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Udsæt ikke tatoveringen for direkte sollys eller solarier
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Brug ikke parfumerede lotions eller produkter med petroleum
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Brug ikke stramt eller ru tøj over tatoveringen</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>Træn ikke hårdt de første par dage</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Drik ikke alkohol i overdrevne mængder under heling
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Produkter */}
          <div className="bg-black/80 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              Anbefalede Produkter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Dag 1-3
                </h3>
                <p className="text-slate-100 text-sm">
                  Aquaphor eller A&D Salve
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Dag 4-14
                </h3>
                <p className="text-slate-100 text-sm">
                  Duftfri lotion (Cetaphil, Lubriderm)
                </p>
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Langsigtet
                </h3>
                <p className="text-slate-100 text-sm">Solcreme med SPF 30+</p>
              </div>
            </div>
          </div>

          {/* Varselsignaler */}
          <div className="bg-red-900/100 border border-red-500/30 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-red-500" />
              Hvornår du skal kontakte os
            </h2>
            <p className="text-slate-100 mb-4">
              Kontakt os straks, hvis du oplever:
            </p>
            <ul className="space-y-2 text-slate-100 ">
              <li>• Ekstrem rødme, hævelse eller varme omkring tatoveringen</li>
              <li>• Pus eller usædvanligt udflåd</li>
              <li>• Røde striber ud fra tatoveringsstedet</li>
              <li>• Feber eller kulderystelser</li>
              <li>• Kraftige eller forværrede smerter efter de første dage</li>
              <li>• Tegn på allergisk reaktion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
