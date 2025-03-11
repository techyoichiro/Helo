import Link from 'next/link'
import { ContentWrapper } from '@/app/components/layouts/ContentWrapper'

export default function TermsOfService() {
  return (
    <ContentWrapper>
      <div className="min-h-screen">
        {/* --- ヘッダーとナビゲーション --- */}
        <header className="border-b">
          <nav className="mx-auto py-4 flex space-x-6">
            {/* それぞれのリンクを実際のページに合わせて変更してください */}
            <Link href="/guide" legacyBehavior>
              <a className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
                ガイドとヘルプ
              </a>
            </Link>
            <Link href="/terms" legacyBehavior>
              <a className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
                利用規約
              </a>
            </Link>
            <Link href="/privacy" legacyBehavior>
              <a className="text-gray-700 font-medium hover:text-orange-500 transition-colors">
                プライバシーポリシー
              </a>
            </Link>
          </nav>
        </header>

        {/* --- メインコンテンツ: 利用規約本文 --- */}
        <div className="space-y-8">
          <article
            className="
              rounded-lg
              bg-[#FFF8ED]
              px-6
              py-8
              mx-auto
              space-y-10
            "
          >
            {/* 大見出し */}
            <h1
              className="
                text-3xl
                font-bold
                text-gray-800
                border-l-8
                border-orange-400
                pl-4
              "
            >
              利用規約
            </h1>

            <p className="text-gray-700 leading-relaxed font-bold">
              この利用規約（以下、「本規約」といいます。）は、
              Helo（以下「当社」といいます。）が
              このウェブサイト上で提供するサービス（以下、「本サービス」
              といいます。）の利用条件を定めるものです。登録ユーザーの皆さま
              （以下、「ユーザー」といいます。）には、
              本規約に従って、本サービスをご利用いただきます。
            </p>

            {/* 第1条 */}
            <section className="space-y-4">
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-gray-800
                  border-l-4
                  border-orange-300
                  pl-3
                "
              >
                第1条（適用）
              </h2>
              <ol className="list-decimal list-inside space-y-2 pl-6 text-gray-700 font-bold">
                <li>
                  本規約は、ユーザーと当社との間の本サービスの利用に関わる
                  一切の関係に適用されるものとします。
                </li>
                <li>
                  当社は本サービスに関し、本規約のほか、ご利用にあたっての
                  ルール等、各種の定め（以下、「個別規定」と
                  いいます。）をすることがあります。これら個別規定は
                  その名称のいかんに関わらず、本規約の一部を構成するものとします。
                </li>
                <li>
                  本規約の規定が前条の個別規定の規定と
                  矛盾する場合には、個別規定において特段の定めなき限り、
                  個別規定の規定が優先されるものとします。
                </li>
              </ol>
            </section>

            {/* 第2条 */}
            <section className="space-y-4">
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-gray-800
                  border-l-4
                  border-orange-300
                  pl-3
                "
              >
                第2条（利用登録）
              </h2>
              <ol className="list-decimal list-inside space-y-2 pl-6 text-gray-700 font-bold">
                <li>
                  本サービスにおいては、登録希望者が本規約に同意の上、
                  当社の定める方法によって利用登録を申請し、
                  当社がこれを承認することによって、
                  利用登録が完了するものとします。
                </li>
                <li>
                  当社は、利用登録の申請者に以下の事由があると判断した場合、
                  利用登録の申請を承認しないことがあり、
                  その理由については一切の開示義務を負わないものとします。
                  <ul className="list-disc list-inside ml-6 space-y-1 font-bold">
                    <li>利用登録の申請に際して虚偽の事項を届け出た場合</li>
                    <li>本規約に違反したことがある者からの申請である場合</li>
                    <li>その他、当社が利用登録を相当でないと判断した場合</li>
                  </ul>
                </li>
              </ol>
            </section>

            {/* 第3条 */}
            <section className="space-y-4">
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-gray-800
                  border-l-4
                  border-orange-300
                  pl-3
                "
              >
                第3条（ユーザーIDおよびパスワードの管理）
              </h2>
              <ol className="list-decimal list-inside space-y-2 pl-6 text-gray-700 font-bold">
                <li>
                  ユーザーは、自己の責任において、
                  本サービスのユーザーIDおよびパスワードを適切に管理するものとします。
                </li>
                <li>
                  ユーザーは、いかなる場合にも、ユーザーIDおよびパスワードを
                  第三者に譲渡または貸与し、もしくは第三者と共用することはできません。
                  当社は、ユーザーIDとパスワードの組み合わせが登録情報と一致して
                  ログインされた場合には、そのユーザーIDを登録しているユーザー自身に
                  よる利用とみなします。
                </li>
                <li>
                  ユーザーID及びパスワードが第三者によって使用されたことによって
                  生じた損害は、当社に故意又は重大な過失がある場合を除き、
                  当社は一切の責任を負わないものとします。
                </li>
              </ol>
            </section>

            {/* 第4条 */}
            <section className="space-y-4">
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-gray-800
                  border-l-4
                  border-orange-300
                  pl-3
                "
              >
                第4条（利用料金および支払方法）
              </h2>
              <ol className="list-decimal list-inside space-y-2 pl-6 text-gray-700 font-bold">
                <li>
                  ユーザーは、本サービスの有料部分の対価として、
                  当社が別途定め、本ウェブサイトに表示する利用料金を、
                  当社が指定する方法により支払うものとします。
                </li>
                <li>
                  ユーザーが利用料金の支払を遅滞した場合には、
                  ユーザーは年14.6%の割合による遅延損害金を支払うものとします。
                </li>
              </ol>
            </section>

            {/* 第5条 */}
            <section className="space-y-4">
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-gray-800
                  border-l-4
                  border-orange-300
                  pl-3
                "
              >
                第5条（禁止事項）
              </h2>
              <p className="text-gray-700 leading-relaxed font-bold">
                ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
              </p>
              <ol className="list-decimal list-inside space-y-2 pl-6 text-gray-700 font-bold">
                <li>法令または公序良俗に違反する行為</li>
                <li>犯罪行為に関連する行為</li>
                <li>
                  本サービスの内容等、
                  本サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為
                </li>
                <li>
                  当社、ほかのユーザー、またはその他第三者のサーバーまたは
                  ネットワークの機能を破壊したり、妨害したりする行為
                </li>
                <li>
                  本サービスによって得られた情報を商業的に利用する行為
                </li>
                <li>当社のサービスの運営を妨害するおそれのある行為</li>
                <li>不正アクセスをし、またはこれを試みる行為</li>
                <li>他のユーザーに関する個人情報等を収集または蓄積する行為</li>
                <li>不正な目的を持って本サービスを利用する行為</li>
                <li>
                  本サービスの他のユーザーまたはその他の第三者に
                  不利益、損害、不快感を与える行為
                </li>
                <li>他のユーザーに成りすます行為</li>
                <li>
                  当社が許諾しない本サービス上での宣伝、広告、勧誘、
                  または営業行為
                </li>
                <li>面識のない異性との出会いを目的とした行為</li>
                <li>
                  当社のサービスに関連して、反社会的勢力に対して直接または
                  間接に利益を供与する行為
                </li>
                <li>その他、当社が不適切と判断する行為</li>
              </ol>
            </section>

            {/* 第6条 */}
            <section className="space-y-4">
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-gray-800
                  border-l-4
                  border-orange-300
                  pl-3
                "
              >
                第6条（本サービスの提供の停止等）
              </h2>
              <ol className="list-decimal list-inside space-y-2 pl-6 text-gray-700 font-bold">
                <li>
                  当社は、以下のいずれかの事由があると判断した場合、
                  ユーザーに事前に通知することなく本サービスの全部または一部の提供を
                  停止または中断することができるものとします。
                  <ul className="list-disc list-inside ml-6 space-y-1 font-bold">
                    <li>
                      本サービスにかかるコンピュータシステムの保守点検または
                      更新を行う場合
                    </li>
                    <li>
                      地震、落雷、火災、停電または天災などの不可抗力により、
                      本サービスの提供が困難となった場合
                    </li>
                    <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                    <li>その他、当社が本サービスの提供が困難と判断した場合</li>
                  </ul>
                </li>
                <li>
                  当社は、本サービスの提供の停止または中断により、
                  ユーザーまたは第三者が被ったいかなる不利益または損害についても、
                  一切の責任を負わないものとします。
                </li>
              </ol>
            </section>

            {/* 第7条 */}
            <section className="space-y-4">
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-gray-800
                  border-l-4
                  border-orange-300
                  pl-3
                "
              >
                第7条（利用制限および登録抹消）
              </h2>
              <ol className="list-decimal list-inside space-y-2 pl-6 text-gray-700 font-bold">
                <li>
                  当社は、ユーザーが以下のいずれかに該当する場合には、
                  事前の通知なく、ユーザーに対して、
                  本サービスの全部もしくは一部の利用を制限し、
                  またはユーザーとしての登録を抹消することができるものとします。
                  <ul className="list-disc list-inside ml-6 space-y-1 font-bold">
                    <li>本規約のいずれかの条項に違反した場合</li>
                    <li>登録事項に虚偽の事実があることが判明した場合</li>
                    <li>料金等の支払債務の不履行があった場合</li>
                    <li>当社からの連絡に対し、一定期間返答がない場合</li>
                    <li>本サービスについて、最終の利用から一定期間利用がない場合</li>
                    <li>その他、当社が本サービスの利用を適当でないと判断した場合</li>
                  </ul>
                </li>
                <li>
                  当社は、本条に基づき当社が行った行為により
                  ユーザーに生じた損害について、一切の責任を負いません。
                </li>
              </ol>
            </section>

            {/* 第8条 */}
            <section className="space-y-4">
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-gray-800
                  border-l-4
                  border-orange-300
                  pl-3
                "
              >
                第8条（退会）
              </h2>
              <p className="text-gray-700 leading-relaxed font-bold">
                ユーザーは、当社の定める退会手続により、
                本サービスから退会できるものとします。
              </p>
            </section>

            {/* 第9条 */}
            <section className="space-y-4">
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-gray-800
                  border-l-4
                  border-orange-300
                  pl-3
                "
              >
                第9条（保証の否認および免責事項）
              </h2>
              <ol className="list-decimal list-inside space-y-2 pl-6 text-gray-700 font-bold">
                <li>
                  当社は、本サービスに事実上または法律上の瑕疵
                  （安全性、信頼性、正確性、完全性、有効性、
                  特定の目的への適合性、セキュリティなどを含みます。）
                  がないことを明示的にも黙示的にも保証しておりません。
                </li>
                <li>
                  当社は、本サービスに起因してユーザーに生じたあらゆる損害について、
                  当社の故意又は重過失による場合を除き、一切の責任を負いません。
                  ただし、本サービスに関する当社とユーザーとの間の契約
                  （本規約を含みます。）
                  が消費者契約法に定める消費者契約となる場合、
                  この免責規定は適用されません。
                </li>
                <li>
                  前項ただし書に定める場合であっても、当社は、
                  当社の過失（重過失を除きます。）
                  による債務不履行または不法行為によりユーザーに生じた損害のうち
                  特別な事情から生じた損害（当社またはユーザーが損害発生につき
                  予見し、または予見し得た場合を含みます。）
                  について一切の責任を負いません。
                  また、当社の過失（重過失を除きます。）
                  による債務不履行または不法行為によりユーザーに生じた損害の賠償は、
                  ユーザーから当該損害が発生した月に受領した利用料の額を上限とします。
                </li>
                <li>
                  当社は、本サービスに関して、
                  ユーザーと他のユーザーまたは第三者との間において生じた取引、
                  連絡または紛争等について一切責任を負いません。
                </li>
              </ol>
            </section>

            {/* 第10条 */}
            <section className="space-y-4">
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-gray-800
                  border-l-4
                  border-orange-300
                  pl-3
                "
              >
                第10条（サービス内容の変更等）
              </h2>
              <p className="text-gray-700 leading-relaxed font-bold">
                当社は、ユーザーへの事前の告知をもって、
                本サービスの内容を変更、追加または廃止することがあり、
                ユーザーはこれを承諾するものとします。
              </p>
            </section>

            {/* 第11条 */}
            <section className="space-y-4">
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-gray-800
                  border-l-4
                  border-orange-300
                  pl-3
                "
              >
                第11条（利用規約の変更）
              </h2>
              <ol className="list-decimal list-inside space-y-2 pl-6 text-gray-700 font-bold">
                <li>
                  当社は以下の場合には、ユーザーの個別の同意を要せず、
                  本規約を変更することができるものとします。
                  <ul className="list-disc list-inside ml-6 space-y-1 font-bold">
                    <li>本規約の変更がユーザーの一般の利益に適合するとき。</li>
                    <li>
                      本規約の変更が本サービス利用契約の目的に反せず、
                      かつ、変更の必要性、変更後の内容の相当性
                      その他の変更に係る事情に照らして合理的なものであるとき。
                    </li>
                  </ul>
                </li>
                <li>
                  当社はユーザーに対し、前項による本規約の変更にあたり、
                  事前に、本規約を変更する旨及び変更後の本規約の内容
                  並びにその効力発生時期を通知します。
                </li>
              </ol>
            </section>

            {/* 第12条 */}
            <section className="space-y-4">
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-gray-800
                  border-l-4
                  border-orange-300
                  pl-3
                "
              >
                第12条（個人情報の取扱い）
              </h2>
              <p className="text-gray-700 leading-relaxed font-bold">
                当社は、本サービスの利用によって取得する個人情報については、
                当社「プライバシーポリシー」に従い
                適切に取り扱うものとします。
              </p>
            </section>

            {/* 第13条 */}
            <section className="space-y-4">
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-gray-800
                  border-l-4
                  border-orange-300
                  pl-3
                "
              >
                第13条（通知または連絡）
              </h2>
              <p className="text-gray-700 leading-relaxed font-bold">
                ユーザーと当社との間の通知または連絡は、
                当社の定める方法によって行うものとします。
                当社は、ユーザーから、当社が別途定める方式に従った
                変更届け出がない限り、現在登録されている連絡先が有効なものとみなし、
                当該連絡先へ通知または連絡を行い、これらは、
                発信時にユーザーへ到達したものとみなします。
              </p>
            </section>

            {/* 第14条 */}
            <section className="space-y-4">
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-gray-800
                  border-l-4
                  border-orange-300
                  pl-3
                "
              >
                第14条（権利義務の譲渡の禁止）
              </h2>
              <p className="text-gray-700 leading-relaxed font-bold">
                ユーザーは、当社の書面による事前の承諾なく、
                利用契約上の地位または本規約に基づく権利もしくは義務を
                第三者に譲渡し、または担保に供することはできません。
              </p>
            </section>

            {/* 第15条 */}
            <section className="space-y-4">
              <h2
                className="
                  text-2xl
                  font-semibold
                  text-gray-800
                  border-l-4
                  border-orange-300
                  pl-3
                "
              >
                第15条（準拠法・裁判管轄）
              </h2>
              <ol className="list-decimal list-inside space-y-2 pl-6 text-gray-700 font-bold">
                <li>
                  本規約の解釈にあたっては、日本法を準拠法とします。
                </li>
                <li>
                  本サービスに関して紛争が生じた場合には、
                  当社の本店所在地を管轄する裁判所を
                  専属的合意管轄とします。
                </li>
              </ol>
            </section>

            <p className="text-gray-700">以上</p>
          </article>

          {/* お好みでフッターなどをここに配置 */}
        </div>
      </div>
    </ContentWrapper>
  )
}
