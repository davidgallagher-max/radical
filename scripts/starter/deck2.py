# Starter 2: words 101 to 200. (trad|simp|tw pinyin|cn pinyin or ""|meaning), then sentences that use only words so far.
W = """六|六|liù||six
七|七|qī||seven
八|八|bā||eight
九|九|jiǔ||nine
百|百|bǎi||hundred
月|月|yuè||month
號|号|hào||day of the month; number
星期|星期|xīngqí|xīngqī|week
早上|早上|zǎoshàng|zǎoshang|morning
晚上|晚上|wǎnshàng|wǎnshang|evening, night
下午|下午|xiàwǔ||afternoon
天|天|tiān||day; sky
哥哥|哥哥|gēge||older brother
姐姐|姐姐|jiějie||older sister
弟弟|弟弟|dìdi||younger brother
妹妹|妹妹|mèimei||younger sister
女|女|nǚ||woman, female
男|男|nán||man, male
同學|同学|tóngxué||classmate
醫生|医生|yīshēng|yīsheng|doctor
學校|学校|xuéxiào||school
中國|中国|Zhōngguó||China
台灣|台湾|Táiwān||Taiwan
美國|美国|Měiguó||America, the US
地方|地方|dìfāng|dìfang|place
房子|房子|fángzi||house
聽|听|tīng||to listen, hear
寫|写|xiě||to write
讀|读|dú||to read; to study
問|问|wèn||to ask
等|等|děng||to wait
找|找|zhǎo||to look for, find
給|给|gěi||to give; for, to
用|用|yòng||to use
住|住|zhù||to live (somewhere)
坐|坐|zuò||to sit; to ride (a car, train)
睡覺|睡觉|shuìjiào||to sleep, go to bed
電話|电话|diànhuà||phone, phone call
打|打|dǎ||to hit; to make (a call); to play
手機|手机|shǒujī||cell phone
電腦|电脑|diànnǎo||computer
電影|电影|diànyǐng||movie
音樂|音乐|yīnyuè||music
好吃|好吃|hǎochī||tasty, delicious
好看|好看|hǎokàn||good-looking; good (to watch or read)
漂亮|漂亮|piàoliàng|piàoliang|pretty, beautiful
高|高|gāo||tall, high
快|快|kuài||fast, quick; soon
慢|慢|màn||slow
新|新|xīn||new
忙|忙|máng||busy
累|累|lèi||tired
高興|高兴|gāoxìng||happy, glad
貴|贵|guì||expensive
便宜|便宜|piányí|piányi|cheap
難|难|nán||hard, difficult
遠|远|yuǎn||far
近|近|jìn||near, close
還|还|hái||still; also; more
最|最|zuì||most
真|真|zhēn||really; real
非常|非常|fēicháng||very, extremely
一起|一起|yìqǐ||together
已經|已经|yǐjīng||already
但是|但是|dànshì||but
所以|所以|suǒyǐ||so, therefore
怎麼|怎么|zěnme||how; why, how come
怎麼樣|怎么样|zěnmeyàng||how is it; how about
吧|吧|ba||(suggests; checks: "let's", "right?")
呢|呢|ne||(and you?; where is...?)
過|过|guò||(have done before); to pass
得|得|de||(how something is done: 說得很好)
從|从|cóng||from
跟|跟|gēn||with; and; to follow
菜|菜|cài||dish, food; vegetable
肉|肉|ròu||meat
水果|水果|shuǐguǒ||fruit
咖啡|咖啡|kāfēi||coffee
衣服|衣服|yīfú|yīfu|clothes
天氣|天气|tiānqì||weather
下雨|下雨|xiàyǔ||to rain
字|字|zì||character, word (written)
話|话|huà||words, speech
問題|问题|wèntí||question; problem
事|事|shì||thing, matter, business
意思|意思|yìsī|yìsi|meaning
能|能|néng||can, be able to
覺得|觉得|juéde||to feel, think
讓|让|ràng||to let; to make (someone)
認識|认识|rènshì|rènshi|to know (a person); to recognize
懂|懂|dǒng||to understand
開始|开始|kāishǐ||to start, begin
帶|带|dài||to bring, take
幫|帮|bāng||to help
玩|玩|wán||to play, have fun
跑|跑|pǎo||to run
一點|一点|yìdiǎn||a little, a bit
這裡|这里|zhèlǐ|zhèli|here
那裡|那里|nàlǐ|nàli|there
還是|还是|háishì|háishi|or (in questions); still"""
EX = {
"六": [("我有六個。","I have six."),("現在六點。","It's six o'clock."),("我們六點吃飯。","We eat at six.")],
"七": [("七點了！","It's seven already!"),("她有七個朋友。","She has seven friends."),("他七點回家。","He gets home at seven.")],
"八": [("我八點去工作。","I go to work at eight."),("八個人都來了。","All eight people came."),("現在八點。","It's eight o'clock.")],
"九": [("九點了，你在哪裡？","It's nine. Where are you?"),("我們有九個學生。","We have nine students."),("他九點沒有回家。","He wasn't home by nine.")],
"百": [("一百個人。","A hundred people."),("這個多少錢？一百。","How much is this? A hundred."),("我有三百個。","I have three hundred.")],
"月": [("我三月去。","I'm going in March."),("他們十月來。","They're coming in October."),("一年有十二個月。","A year has twelve months.")],
"號": [("今天幾號？","What's the date today?"),("今天五號。","Today is the fifth."),("我十月三號去。","I'm going on October third.")],
"星期": [("今天星期幾？","What day is it today?"),("今天星期三。","Today is Wednesday."),("星期五我要工作。","I have to work on Friday.")],
"早上": [("早上好！","Good morning!"),("我早上喝茶。","I drink tea in the morning."),("你早上幾點去工作？","What time do you go to work in the morning?")],
"晚上": [("晚上我在家。","I'm home in the evening."),("你們晚上吃什麼？","What are you having tonight?"),("我晚上不喝茶。","I don't drink tea at night.")],
"下午": [("下午三點。","Three in the afternoon."),("我下午有時間。","I'm free this afternoon."),("他們下午來。","They're coming this afternoon.")],
"天": [("我要去五天。","I'm going for five days."),("他工作了十天。","He worked for ten days."),("一年有多少天？","How many days are in a year?")],
"哥哥": [("這是我哥哥。","This is my older brother."),("你有哥哥嗎？","Do you have an older brother?"),("我哥哥是老師。","My older brother is a teacher.")],
"姐姐": [("她是我姐姐。","She's my older sister."),("你姐姐在哪裡工作？","Where does your sister work?"),("我沒有姐姐。","I don't have an older sister.")],
"弟弟": [("我有一個弟弟。","I have a younger brother."),("弟弟在家。","My little brother is home."),("你弟弟叫什麼名字？","What's your little brother's name?")],
"妹妹": [("我妹妹也是學生。","My younger sister is a student too."),("這是我妹妹的書。","This is my little sister's book."),("妹妹喜歡貓。","My little sister likes cats.")],
"女": [("那個女的是誰？","Who's that woman?"),("這個老師是女的。","This teacher is a woman."),("她有一個女孩子。","She has a little girl.")],
"男": [("那個男的是我哥哥。","That man is my older brother."),("男的、女的都來了。","Men and women both came."),("老師是男的。","The teacher is a man.")],
"同學": [("他是我同學。","He's my classmate."),("我的同學都很好。","My classmates are all nice."),("你們是同學嗎？","Are you classmates?")],
"醫生": [("我媽媽是醫生。","My mom is a doctor."),("你想做醫生嗎？","Do you want to be a doctor?"),("我要去看醫生。","I need to see a doctor.")],
"學校": [("我們學校很大。","Our school is big."),("學校在哪裡？","Where's the school?"),("我明天不去學校。","I'm not going to school tomorrow.")],
"中國": [("他是中國人。","He's Chinese."),("我想去中國。","I want to go to China."),("中國很大。","China is huge.")],
"台灣": [("我在台灣。","I'm in Taiwan."),("台灣人很好。","Taiwanese people are very nice."),("你要去台灣嗎？","Are you going to Taiwan?")],
"美國": [("我是美國人。","I'm American."),("她在美國工作。","She works in the US."),("美國和中國都很大。","America and China are both big.")],
"地方": [("這是什麼地方？","What is this place?"),("這個地方很好。","This is a nice place."),("你家在什麼地方？","Where is your home?")],
"房子": [("這個房子很大。","This house is big."),("他們有一個大房子。","They have a big house."),("我想買房子。","I want to buy a house.")],
"聽": [("你聽！","Listen!"),("我在聽。","I'm listening."),("他不聽我說。","He won't listen to me.")],
"寫": [("你會寫中文嗎？","Can you write Chinese?"),("寫你的名字。","Write your name."),("我不會寫。","I can't write it.")],
"讀": [("你在讀什麼？","What are you reading?"),("她在學校讀書。","She's at school, studying."),("我喜歡讀書。","I like to read.")],
"問": [("我想問你。","I want to ask you something."),("你問誰？","Who are you asking?"),("問老師。","Ask the teacher.")],
"等": [("等我！","Wait for me!"),("等一下！","Wait a moment!"),("我在等你。","I'm waiting for you.")],
"找": [("你找誰？","Who are you looking for?"),("我在找我的書。","I'm looking for my book."),("我找不到他。","I can't find him.")],
"給": [("給你。","Here you go."),("我給他一個。","I'll give him one."),("這是給你的。","This is for you.")],
"用": [("你會用嗎？","Do you know how to use it?"),("我可以用這個嗎？","Can I use this?"),("不用了，謝謝。","No need, thanks.")],
"住": [("你住在哪裡？","Where do you live?"),("我住在台灣。","I live in Taiwan."),("我和朋友住。","I live with a friend.")],
"坐": [("你要坐嗎？","Would you like to sit?"),("我們坐車去。","We'll go by car."),("他坐在哪裡？","Where is he sitting?")],
"睡覺": [("我要睡覺了。","I'm going to bed."),("你幾點睡覺？","What time do you go to bed?"),("孩子在睡覺。","The child is asleep.")],
"電話": [("你的電話是多少？","What's your phone number?"),("我沒有他的電話。","I don't have his number."),("有電話！","There's a call!")],
"打": [("我打電話給你。","I'll call you."),("他在打電話。","He's on the phone."),("媽媽打電話來了。","Mom's calling.")],
"手機": [("我的手機在哪裡？","Where's my phone?"),("你有手機嗎？","Do you have a cell phone?"),("他在看手機。","He's looking at his phone.")],
"電腦": [("我用電腦工作。","I work on a computer."),("這個電腦很好。","This computer is very good."),("你有電腦嗎？","Do you have a computer?")],
"電影": [("你喜歡看電影嗎？","Do you like movies?"),("我們今天晚上看電影。","We're watching a movie tonight."),("這是什麼電影？","What movie is this?")],
"音樂": [("我喜歡聽音樂。","I like listening to music."),("你在聽什麼音樂？","What music are you listening to?"),("他會做音樂。","He can make music.")],
"好吃": [("這個很好吃！","This is delicious!"),("什麼東西好吃？","What's good to eat?"),("媽媽做的飯很好吃。","Mom's cooking is delicious.")],
"好看": [("這個電影很好看。","This movie is very good."),("她很好看。","She's good-looking."),("那個房子很好看。","That house looks nice.")],
"漂亮": [("你姐姐很漂亮。","Your sister is beautiful."),("台灣很漂亮。","Taiwan is beautiful."),("她的房子很漂亮。","Her house is lovely.")],
"高": [("他很高。","He's tall."),("你多高？","How tall are you?"),("那個人太高了！","That guy is so tall!")],
"快": [("快來！","Come quick!"),("你太快了！","You're too fast!"),("快點走！","Hurry up!")],
"慢": [("你太慢了。","You're too slow."),("我說中文很慢。","I speak Chinese slowly."),("慢慢來。","Take your time.")],
"新": [("這是我的新手機。","This is my new phone."),("你有新朋友嗎？","Do you have new friends?"),("我們有一個新老師。","We have a new teacher.")],
"忙": [("你忙嗎？","Are you busy?"),("我今天很忙。","I'm busy today."),("媽媽太忙了。","Mom is too busy.")],
"累": [("我好累！","I'm so tired!"),("你累了嗎？","Are you tired?"),("工作很累。","Work is tiring.")],
"高興": [("我很高興。","I'm happy."),("她今天不高興。","She's not happy today."),("你們來了，我很高興。","I'm glad you came.")],
"貴": [("這個太貴了！","This is too expensive!"),("貴不貴？","Is it expensive?"),("那個手機很貴。","That phone is expensive.")],
"便宜": [("這個很便宜。","This is cheap."),("有便宜的嗎？","Is there a cheaper one?"),("什麼東西便宜？","What's cheap?")],
"難": [("中文很難嗎？","Is Chinese hard?"),("寫中文很難。","Writing Chinese is hard."),("不難！","It's not hard!")],
"遠": [("你家遠嗎？","Is your home far?"),("學校很遠。","The school is far."),("美國太遠了。","America is too far.")],
"近": [("我家很近。","My place is close."),("學校近不近？","Is the school close?"),("台灣近，美國遠。","Taiwan is close; America is far.")],
"還": [("我還要。","I want more."),("他還在睡覺。","He's still asleep."),("你還好嗎？","Are you OK?")],
"最": [("我最喜歡你。","I like you best."),("這個最好。","This one's the best."),("她是我最好的朋友。","She's my best friend.")],
"真": [("真的嗎？","Really?"),("你真好！","You're so kind!"),("這個真好吃。","This is really good.")],
"非常": [("非常好！","Very good!"),("我非常忙。","I'm extremely busy."),("台灣非常漂亮。","Taiwan is very beautiful.")],
"一起": [("我們一起去！","Let's go together!"),("你要一起吃飯嗎？","Do you want to eat with us?"),("他們住在一起。","They live together.")],
"已經": [("我已經吃了。","I've already eaten."),("他已經回家了。","He's already gone home."),("已經十點了！","It's already ten!")],
"但是": [("我想去，但是我很忙。","I want to go, but I'm busy."),("這個很好，但是太貴了。","This is nice, but it's too expensive."),("她很高，但是她弟弟很小。","She's tall, but her little brother is small.")],
"所以": [("我很累，所以我要睡覺。","I'm tired, so I'm going to bed."),("他是老師，所以他很忙。","He's a teacher, so he's busy."),("太貴了，所以我不買。","It's too expensive, so I won't buy it.")],
"怎麼": [("你怎麼來了？","How come you're here?"),("這個怎麼用？","How do you use this?"),("你怎麼去學校？","How do you get to school?")],
"怎麼樣": [("你今天怎麼樣？","How are you today?"),("這個怎麼樣？","How about this one?"),("那個電影怎麼樣？","How was that movie?")],
"吧": [("我們走吧！","Let's go!"),("你是老師吧？","You're a teacher, right?"),("好吧。","All right.")],
"呢": [("你呢？","And you?"),("我很好，你呢？","I'm fine. And you?"),("我的手機呢？","Where's my phone?")],
"過": [("你去過台灣嗎？","Have you been to Taiwan?"),("我沒有去過美國。","I've never been to America."),("我看過這個電影。","I've seen this movie.")],
"得": [("他說得很好。","He speaks well."),("你走得太快了。","You walk too fast."),("她寫得非常漂亮。","She writes beautifully.")],
"從": [("你從哪裡來？","Where are you from?"),("我從美國來。","I'm from America."),("他從學校回家。","He's coming home from school.")],
"跟": [("你跟我來。","Come with me."),("我跟朋友去看電影。","I'm going to a movie with friends."),("我想跟你一起去。","I want to go with you.")],
"菜": [("你喜歡吃什麼菜？","What food do you like?"),("台灣菜很好吃。","Taiwanese food is delicious."),("媽媽在做菜。","Mom is cooking.")],
"肉": [("我不吃肉。","I don't eat meat."),("這是什麼肉？","What meat is this?"),("他很喜歡吃肉。","He loves meat.")],
"水果": [("我要買水果。","I want to buy some fruit."),("台灣的水果很好吃。","Taiwan's fruit is delicious."),("你喜歡什麼水果？","What fruit do you like?")],
"咖啡": [("你喝咖啡嗎？","Do you drink coffee?"),("我早上喝咖啡。","I drink coffee in the morning."),("咖啡太熱了。","The coffee is too hot.")],
"衣服": [("我要買衣服。","I want to buy clothes."),("你的衣服在哪裡？","Where are your clothes?"),("她有很多衣服。","She has lots of clothes.")],
"天氣": [("今天天氣很好。","The weather's nice today."),("天氣太熱了。","It's too hot."),("明天天氣怎麼樣？","What's the weather like tomorrow?")],
"下雨": [("下雨了！","It's raining!"),("明天會下雨嗎？","Will it rain tomorrow?"),("下雨，所以我不去了。","It's raining, so I'm not going.")],
"字": [("這個字怎麼說？","How do you say this character?"),("你會寫這個字嗎？","Can you write this character?"),("這是什麼字？","What character is this?")],
"話": [("我想跟你說話。","I want to talk with you."),("你說的話很對。","What you said is right."),("他不說話。","He won't talk.")],
"問題": [("我有一個問題。","I have a question."),("沒有問題！","No problem!"),("這個問題很難。","This question is hard.")],
"事": [("有事嗎？","Is something up?"),("你有什麼事？","What do you need?"),("我今天有事。","I have something on today.")],
"意思": [("這是什麼意思？","What does this mean?"),("我不知道這個字的意思。","I don't know what this character means."),("很有意思！","Very interesting!")],
"能": [("你能來嗎？","Can you come?"),("我今天不能去。","I can't go today."),("這個能吃嗎？","Can you eat this?")],
"覺得": [("你覺得怎麼樣？","What do you think?"),("我覺得很好。","I think it's great."),("她覺得中文很難。","She finds Chinese hard.")],
"讓": [("讓我看看。","Let me see."),("媽媽不讓我去。","Mom won't let me go."),("讓他說。","Let him speak.")],
"認識": [("認識你很高興。","Nice to meet you."),("你認識他嗎？","Do you know him?"),("我不認識這個字。","I don't know this character.")],
"懂": [("你懂嗎？","Do you understand?"),("我不懂。","I don't understand."),("我聽不懂。","I can't understand what I'm hearing.")],
"開始": [("我們開始吧。","Let's begin."),("電影開始了！","The movie's starting!"),("我明天開始工作。","I start work tomorrow.")],
"帶": [("你帶手機了嗎？","Did you bring your phone?"),("我帶你去。","I'll take you there."),("她帶孩子去學校。","She takes her child to school.")],
"幫": [("我幫你。","I'll help you."),("你可以幫我嗎？","Can you help me?"),("謝謝你幫我。","Thanks for helping me.")],
"玩": [("我們去玩吧！","Let's go have fun!"),("孩子在玩。","The kids are playing."),("你想玩什麼？","What do you want to play?")],
"跑": [("他跑得很快。","He runs fast."),("狗在跑。","The dog is running."),("我們跑吧！","Let's run!")],
"一點": [("我會說一點中文。","I speak a little Chinese."),("慢一點！","A bit slower!"),("我要一點水。","I'd like a little water.")],
"這裡": [("我在這裡。","I'm here."),("這裡很漂亮。","It's beautiful here."),("你可以坐這裡。","You can sit here.")],
"那裡": [("他在那裡。","He's over there."),("那裡有很多人。","There are lots of people there."),("你去那裡做什麼？","What are you going there for?")],
"還是": [("你要茶還是咖啡？","Do you want tea or coffee?"),("他還是學生。","He's still a student."),("我們今天去還是明天去？","Shall we go today or tomorrow?")],
}
