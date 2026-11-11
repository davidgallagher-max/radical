# Starter 3: words 201 to 300. (trad|simp|tw pinyin|cn pinyin or ""|meaning), then sentences that use only words so far.
W = """兩|两|liǎng||two (before a measure word)
千|千|qiān||thousand
萬|万|wàn||ten thousand
半|半|bàn||half
塊|块|kuài||dollar (money); piece
本|本|běn||(measure word for books)
杯|杯|bēi||cup, glass (of)
歲|岁|suì||years old
次|次|cì||time (occurrence)
小時|小时|xiǎoshí||hour
分鐘|分钟|fēnzhōng||minute
每|每|měi||every, each
今年|今年|jīnnián||this year
明年|明年|míngnián||next year
去年|去年|qùnián||last year
週末|周末|zhōumò||weekend
上午|上午|shàngwǔ||morning (before noon)
中午|中午|zhōngwǔ||noon
以後|以后|yǐhòu||after; later, in the future
以前|以前|yǐqián||before; in the past
時候|时候|shíhòu|shíhou|time, moment (…的時候: when …)
常常|常常|chángcháng||often
有時候|有时候|yǒushíhòu|yǒushíhou|sometimes
馬上|马上|mǎshàng||right away
自己|自己|zìjǐ||oneself (myself, yourself…)
大家|大家|dàjiā||everyone
別人|别人|biérén||other people
請|请|qǐng||please; to invite; to treat
別|别|bié||don't
哪|哪|nǎ||which
這樣|这样|zhèyàng||like this, this way
那麼|那么|nàme||so; then, in that case
多久|多久|duōjiǔ||how long
只|只|zhǐ||only, just
才|才|cái||only then; not until; just
又|又|yòu||again (already happened)
更|更|gèng||even more
比|比|bǐ||than; compared to
比較|比较|bǐjiào||rather, fairly; to compare
特別|特别|tèbié||especially; special
當然|当然|dāngrán||of course
其實|其实|qíshí||actually
一定|一定|yídìng||surely, definitely; must
可能|可能|kěnéng||maybe, possibly
應該|应该|yīnggāi||should
需要|需要|xūyào||to need
希望|希望|xīwàng||to hope
打算|打算|dǎsuàn||to plan to
準備|准备|zhǔnbèi||to get ready, prepare
告訴|告诉|gàosù|gàosu|to tell
教|教|jiāo||to teach
練習|练习|liànxí||to practice
考試|考试|kǎoshì||test, exam
上課|上课|shàngkè||to go to class; class starts
下課|下课|xiàkè||class ends
課|课|kè||class, lesson
功課|功课|gōngkè||homework
早餐|早餐|zǎocān||breakfast
午餐|午餐|wǔcān||lunch
晚餐|晚餐|wǎncān||dinner
麵|面|miàn||noodles
雞蛋|鸡蛋|jīdàn||egg
魚|鱼|yú||fish
牛肉|牛肉|niúròu||beef
雞|鸡|jī||chicken
湯|汤|tāng||soup
麵包|面包|miànbāo||bread
牛奶|牛奶|niúnǎi||milk
果汁|果汁|guǒzhī||juice
酒|酒|jiǔ||alcohol, wine
餓|饿|è||hungry
渴|渴|kě||thirsty
飽|饱|bǎo||full (after eating)
太太|太太|tàitai||wife; Mrs.
兒子|儿子|érzi||son
女兒|女儿|nǚ'ér||daughter
爺爺|爷爷|yéye||grandpa (father's father)
奶奶|奶奶|nǎinai||grandma (father's mother)
小姐|小姐|xiǎojiě||Miss; young lady
穿|穿|chuān||to wear, put on
洗|洗|xǐ||to wash
賣|卖|mài||to sell
送|送|sòng||to give (as a gift); to see off; to deliver
借|借|jiè||to borrow; to lend
拿|拿|ná||to take, hold, pick up
放|放|fàng||to put, place
進|进|jìn||to enter, go in
出|出|chū||to go out, come out
出去|出去|chūqù|chūqu|to go out
進來|进来|jìnlái|jìnlai|to come in
起床|起床|qǐchuáng||to get up
洗澡|洗澡|xǐzǎo||to take a shower or bath
休息|休息|xiūxí|xiūxi|to rest
運動|运动|yùndòng||to exercise; sports
游泳|游泳|yóuyǒng||to swim
唱歌|唱歌|chànggē||to sing
跳舞|跳舞|tiàowǔ||to dance
笑|笑|xiào||to laugh, smile
哭|哭|kū||to cry
生氣|生气|shēngqì||angry; to get angry"""
EX = {
"兩": [("我有兩個弟弟。","I have two younger brothers."),("兩個人一起去。","The two of them are going together."),("現在兩點。","It's two o'clock.")],
"千": [("一千個人。","A thousand people."),("這個三千。","This one is three thousand."),("我有兩千。","I have two thousand.")],
"萬": [("一萬。","Ten thousand."),("三萬個人。","Thirty thousand people."),("我有一萬。","I have ten thousand.")],
"半": [("現在三點半。","It's half past three."),("我吃了一半。","I ate half."),("我去了半個月。","I went for half a month.")],
"塊": [("這個多少塊？","How many dollars is this?"),("一百塊。","A hundred dollars."),("咖啡五十塊。","Coffee is fifty dollars.")],
"本": [("我買了兩本書。","I bought two books."),("這本書很好看。","This book is good."),("你有幾本？","How many do you have?")],
"杯": [("我要一杯咖啡。","I'd like a cup of coffee."),("你要喝杯茶嗎？","Would you like a cup of tea?"),("他喝了三杯水。","He drank three glasses of water.")],
"歲": [("你幾歲？","How old are you?"),("我三十歲。","I'm thirty."),("我弟弟八歲。","My little brother is eight.")],
"次": [("我去過一次。","I've been once."),("再說一次！","Say it again!"),("你來過幾次？","How many times have you been here?")],
"小時": [("我工作了八個小時。","I worked eight hours."),("我們等了一個小時。","We waited an hour."),("你工作了幾個小時？","How many hours did you work?")],
"分鐘": [("等我五分鐘。","Give me five minutes."),("學校很近，走十分鐘。","School's close, a ten-minute walk."),("電影還有二十分鐘開始。","The movie starts in twenty minutes.")],
"每": [("我每天喝咖啡。","I drink coffee every day."),("他每個月去一次。","He goes once a month."),("每個人都來了。","Everyone came.")],
"今年": [("我今年三十歲。","I'm thirty this year."),("今年很忙。","This year is busy."),("你今年要去台灣嗎？","Are you going to Taiwan this year?")],
"明年": [("明年再見！","See you next year!"),("我明年想去中國。","I want to go to China next year."),("她明年開始工作。","She starts work next year.")],
"去年": [("我去年去了台灣。","I went to Taiwan last year."),("去年很冷。","Last year was cold."),("他去年開始學中文。","He started learning Chinese last year.")],
"週末": [("週末你做什麼？","What are you doing this weekend?"),("週末我們在家。","We stay home on weekends."),("週末我們一起去玩吧！","Let's go have fun this weekend!")],
"上午": [("我上午很忙。","I'm busy in the morning."),("上午十點。","Ten in the morning."),("他上午不在。","He's out this morning.")],
"中午": [("中午吃什麼？","What's for lunch?"),("我們中午一起吃飯吧。","Let's have lunch together."),("中午很熱。","It's hot at noon.")],
"以後": [("吃飯以後，我們去看電影。","After we eat, let's see a movie."),("以後再說吧。","Let's talk about it later."),("我以後想做醫生。","I want to be a doctor someday.")],
"以前": [("我以前住在美國。","I used to live in America."),("睡覺以前，我讀書。","I read before bed."),("他以前不喝咖啡。","He didn't use to drink coffee.")],
"時候": [("你什麼時候來？","When are you coming?"),("我吃飯的時候看手機。","I look at my phone while I eat."),("你小的時候住在哪裡？","Where did you live as a kid?")],
"常常": [("我常常去那裡。","I go there often."),("他常常不在家。","He's often out."),("我們常常一起吃飯。","We often eat together.")],
"有時候": [("我有時候喝咖啡。","Sometimes I drink coffee."),("有時候下雨，有時候很熱。","Sometimes it rains, sometimes it's hot."),("她有時候很忙。","She's busy sometimes.")],
"馬上": [("我馬上來！","I'll be right there!"),("電影馬上開始。","The movie's about to start."),("他馬上回來。","He'll be right back.")],
"自己": [("我自己做。","I'll do it myself."),("你自己去吧。","Go by yourself."),("他自己也不知道。","He doesn't know either.")],
"大家": [("大家好！","Hi, everyone!"),("大家都來了。","Everyone's here."),("大家一起吃吧！","Let's all eat!")],
"別人": [("別人都走了。","Everyone else has left."),("這是別人的東西。","This is someone else's."),("我不想問別人。","I don't want to ask anyone else.")],
"請": [("請坐。","Please sit down."),("請問，學校在哪裡？","Excuse me, where's the school?"),("我請你喝咖啡。","Coffee's on me.")],
"別": [("別走！","Don't go!"),("別說了。","Stop talking."),("別太累了。","Don't wear yourself out.")],
"哪": [("哪個是你的？","Which one is yours?"),("你要哪個？","Which one do you want?"),("哪本書是你的？","Which book is yours?")],
"這樣": [("這樣很好。","This is good."),("你怎麼這樣說？","How can you say that?"),("這樣寫對嗎？","Is it right to write it like this?")],
"那麼": [("那麼，我們走吧。","Well then, let's go."),("你那麼忙嗎？","Are you that busy?"),("中文沒有那麼難。","Chinese isn't that hard.")],
"多久": [("你學中文多久了？","How long have you been learning Chinese?"),("要等多久？","How long is the wait?"),("你在台灣住了多久？","How long did you live in Taiwan?")],
"只": [("我只有一個。","I only have one."),("他只喝水。","He only drinks water."),("我只會說一點。","I can only speak a little.")],
"才": [("他十點才來。","He didn't come until ten."),("你怎麼現在才來？","Why are you only coming now?"),("我才三十歲。","I'm only thirty.")],
"又": [("他又來了！","He's here again!"),("又下雨了。","It's raining again."),("她又買了衣服。","She bought clothes again.")],
"更": [("這個更好。","This one's even better."),("今天更冷。","It's even colder today."),("我更喜歡茶。","I like tea more.")],
"比": [("我比他高。","I'm taller than him."),("今天比昨天熱。","Today is hotter than yesterday."),("咖啡比茶貴。","Coffee costs more than tea.")],
"比較": [("這個比較好。","This one's better."),("我比較喜歡喝茶。","I'd rather have tea."),("今天比較冷。","It's colder today.")],
"特別": [("這個菜特別好吃。","This dish is especially good."),("她特別喜歡貓。","She really loves cats."),("今天很特別。","Today is special.")],
"當然": [("當然可以！","Of course you can!"),("我當然要去。","Of course I'm going."),("當然是你的。","It's yours, of course.")],
"其實": [("其實我不喜歡咖啡。","Actually, I don't like coffee."),("其實中文不難。","Chinese actually isn't hard."),("其實他是老師。","He's actually a teacher.")],
"一定": [("你一定要來！","You have to come!"),("他一定知道。","He must know."),("不一定。","Not necessarily.")],
"可能": [("明天可能會下雨。","It might rain tomorrow."),("他可能不來了。","He might not come."),("不可能！","Impossible!")],
"應該": [("你應該多喝水。","You should drink more water."),("我應該走了。","I should get going."),("他應該在家。","He should be home.")],
"需要": [("你需要什麼？","What do you need?"),("我需要一點時間。","I need a little time."),("不需要，謝謝。","No need, thanks.")],
"希望": [("我希望你能來。","I hope you can come."),("希望明天天氣好。","I hope the weather's good tomorrow."),("她希望去美國。","She hopes to go to America.")],
"打算": [("你週末打算做什麼？","What are you planning this weekend?"),("我打算明年去台灣。","I'm planning to go to Taiwan next year."),("他打算自己做。","He plans to do it himself.")],
"準備": [("你準備好了嗎？","Are you ready?"),("媽媽在準備飯。","Mom is getting the food ready."),("我們準備走了。","We're about to leave.")],
"告訴": [("告訴我！","Tell me!"),("他沒有告訴我。","He didn't tell me."),("你可以告訴我嗎？","Can you tell me?")],
"教": [("她教中文。","She teaches Chinese."),("你可以教我嗎？","Can you teach me?"),("媽媽教我做菜。","Mom taught me to cook.")],
"練習": [("我每天練習中文。","I practice Chinese every day."),("我們一起練習吧。","Let's practice together."),("你需要多練習。","You need more practice.")],
"考試": [("明天有考試。","There's a test tomorrow."),("考試難嗎？","Was the test hard?"),("我在準備考試。","I'm studying for a test.")],
"上課": [("我們八點上課。","Class starts at eight."),("你今天上課嗎？","Do you have class today?"),("上課了！","Class is starting!")],
"下課": [("幾點下課？","When does class end?"),("下課以後，我們去吃飯。","After class, let's eat."),("下課了！","Class is over!")],
"課": [("今天沒有課。","There's no class today."),("這個課很有意思。","This class is interesting."),("你有幾個課？","How many classes do you have?")],
"功課": [("我有很多功課。","I have lots of homework."),("你寫功課了嗎？","Did you do your homework?"),("今天沒有功課！","No homework today!")],
"早餐": [("你吃早餐了嗎？","Have you had breakfast?"),("我早餐喝咖啡。","I have coffee for breakfast."),("早餐吃什麼？","What's for breakfast?")],
"午餐": [("我們一起吃午餐吧。","Let's have lunch together."),("午餐太貴了。","Lunch is too expensive."),("你午餐想吃什麼？","What do you want for lunch?")],
"晚餐": [("晚餐好了！","Dinner's ready!"),("我請你吃晚餐。","Dinner's on me."),("晚餐吃什麼？","What's for dinner?")],
"麵": [("你喜歡吃麵嗎？","Do you like noodles?"),("這個麵很好吃。","These noodles are delicious."),("我中午吃麵。","I'm having noodles for lunch.")],
"雞蛋": [("我早餐吃雞蛋。","I have eggs for breakfast."),("你要幾個雞蛋？","How many eggs do you want?"),("我不吃雞蛋。","I don't eat eggs.")],
"魚": [("你喜歡吃魚嗎？","Do you like fish?"),("這個魚很好吃。","This fish is delicious."),("貓喜歡魚。","Cats like fish.")],
"牛肉": [("我不吃牛肉。","I don't eat beef."),("這是牛肉麵。","This is beef noodle soup."),("美國的牛肉很便宜。","Beef is cheap in America.")],
"雞": [("我要雞，不要魚。","I'll have chicken, not fish."),("你吃雞嗎？","Do you eat chicken?"),("這是什麼雞？","What kind of chicken is this?")],
"湯": [("你要喝湯嗎？","Would you like some soup?"),("湯太熱了。","The soup is too hot."),("媽媽做的湯最好喝。","Mom's soup is the best.")],
"麵包": [("我早餐吃麵包。","I have bread for breakfast."),("這個麵包很好吃。","This bread is good."),("你要買麵包嗎？","Do you want to buy bread?")],
"牛奶": [("我要一杯牛奶。","I'd like a glass of milk."),("孩子喜歡喝牛奶。","Kids like milk."),("咖啡要牛奶嗎？","Milk in your coffee?")],
"果汁": [("你要果汁還是牛奶？","Juice or milk?"),("我喝了兩杯果汁。","I drank two glasses of juice."),("這個果汁很好喝。","This juice is tasty.")],
"酒": [("你喝酒嗎？","Do you drink?"),("我不喝酒。","I don't drink."),("他喝了很多酒。","He drank a lot.")],
"餓": [("我好餓！","I'm so hungry!"),("你餓了嗎？","Are you hungry?"),("我不餓，我只想喝水。","I'm not hungry, I just want water.")],
"渴": [("我很渴。","I'm thirsty."),("你渴不渴？","Are you thirsty?"),("天氣太熱，我好渴。","It's so hot. I'm really thirsty.")],
"飽": [("我吃飽了。","I'm full."),("你吃飽了嗎？","Have you had enough?"),("我太飽了！","I'm stuffed!")],
"太太": [("這是我太太。","This is my wife."),("你太太好嗎？","How's your wife?"),("你太太是哪裡人？","Where is your wife from?")],
"兒子": [("我有一個兒子。","I have a son."),("他兒子三歲。","His son is three."),("你兒子在哪裡讀書？","Where does your son go to school?")],
"女兒": [("她有兩個女兒。","She has two daughters."),("我女兒很喜歡貓。","My daughter loves cats."),("你女兒幾歲？","How old is your daughter?")],
"爺爺": [("我爺爺八十歲。","My grandpa is eighty."),("爺爺在家嗎？","Is Grandpa home?"),("我常常去看爺爺。","I often visit Grandpa.")],
"奶奶": [("奶奶做的菜最好吃。","Grandma's cooking is the best."),("我愛奶奶。","I love Grandma."),("奶奶住在台灣。","Grandma lives in Taiwan.")],
"小姐": [("小姐，請問，這個多少錢？","Excuse me, miss, how much is this?"),("那個小姐是誰？","Who's that young lady?"),("小姐，我要一杯咖啡。","Miss, a coffee please.")],
"穿": [("你今天穿什麼？","What are you wearing today?"),("天氣冷，多穿一點。","It's cold. Wear more."),("她穿得很漂亮。","She's dressed beautifully.")],
"洗": [("我要洗衣服。","I need to do laundry."),("我在洗車。","I'm washing the car."),("我來洗。","I'll wash up.")],
"賣": [("這個賣多少錢？","How much does this sell for?"),("那裡賣什麼？","What do they sell there?"),("他要賣房子。","He's selling his house.")],
"送": [("這是我送你的。","This is a gift for you."),("我送你回家。","I'll take you home."),("他送我一本書。","He gave me a book.")],
"借": [("我可以借你的手機嗎？","Can I borrow your phone?"),("我借你一百塊。","I'll lend you a hundred dollars."),("這本書是我借的。","I borrowed this book.")],
"拿": [("你拿什麼？","What are you holding?"),("我幫你拿。","Let me carry that."),("請拿一個。","Please take one.")],
"放": [("你放在哪裡了？","Where did you put it?"),("放在這裡吧。","Put it here."),("你放了什麼？","What did you put in?")],
"進": [("請進！","Come in!"),("他進了房子。","He went into the house."),("我可以進嗎？","May I come in?")],
"出": [("出了什麼事？","What happened?"),("他不想出來。","He doesn't want to come out."),("他從房子裡出來了。","He came out of the house.")],
"出去": [("我出去一下。","I'm stepping out for a bit."),("我們出去吃飯吧。","Let's eat out."),("他出去了。","He went out.")],
"進來": [("進來吧！","Come on in!"),("你怎麼進來的？","How did you get in?"),("請他進來。","Ask him in.")],
"起床": [("你幾點起床？","What time do you get up?"),("起床了！","Time to get up!"),("我七點起床。","I get up at seven.")],
"洗澡": [("我要洗澡。","I'm going to take a shower."),("他在洗澡。","He's in the shower."),("你晚上洗澡還是早上洗澡？","Do you shower at night or in the morning?")],
"休息": [("你應該休息。","You should rest."),("我們休息一下吧。","Let's take a break."),("週末我在家休息。","I'm resting at home this weekend.")],
"運動": [("你喜歡運動嗎？","Do you like sports?"),("我每天運動。","I exercise every day."),("運動以後，我很餓。","I'm hungry after a workout.")],
"游泳": [("你會游泳嗎？","Can you swim?"),("我們去游泳吧！","Let's go swimming!"),("他很會游泳。","He's a good swimmer.")],
"唱歌": [("她很會唱歌。","She's a great singer."),("我們去唱歌吧！","Let's go sing!"),("你喜歡唱歌嗎？","Do you like singing?")],
"跳舞": [("你會跳舞嗎？","Can you dance?"),("她很喜歡跳舞。","She loves dancing."),("我們一起跳舞吧。","Let's dance together.")],
"笑": [("你笑什麼？","What are you laughing at?"),("她笑了。","She smiled."),("別笑我！","Don't laugh at me!")],
"哭": [("別哭。","Don't cry."),("孩子在哭。","The child is crying."),("她為什麼哭？","Why is she crying?")],
"生氣": [("你生氣了嗎？","Are you angry?"),("別生氣！","Don't be mad!"),("媽媽很生氣。","Mom is very angry.")],
}
