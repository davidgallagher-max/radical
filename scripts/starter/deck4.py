# Starter 4: words 301 to 400. (trad|simp|tw pinyin|cn pinyin or ""|meaning), then sentences that use only words so far.
W = """公司|公司|gōngsī||company
醫院|医院|yīyuàn||hospital
銀行|银行|yínháng||bank
商店|商店|shāngdiàn||store, shop
超市|超市|chāoshì||supermarket
餐廳|餐厅|cāntīng||restaurant
公園|公园|gōngyuán||park
圖書館|图书馆|túshūguǎn||library
機場|机场|jīchǎng||airport
火車|火车|huǒchē||train
站|站|zhàn||station, stop; to stand
飛機|飞机|fēijī||airplane
路|路|lù||road, way
左邊|左边|zuǒbiān|zuǒbian|left, the left side
右邊|右边|yòubiān|yòubian|right, the right side
前面|前面|qiánmiàn|qiánmian|in front, ahead
後面|后面|hòumiàn|hòumian|behind, at the back
旁邊|旁边|pángbiān||next to, beside
外面|外面|wàimiàn|wàimian|outside
上面|上面|shàngmiàn|shàngmian|on top, above
下面|下面|xiàmiàn|xiàmian|below, under
頭|头|tóu||head
手|手|shǒu||hand
眼睛|眼睛|yǎnjīng|yǎnjing|eye
身體|身体|shēntǐ||body; health
生病|生病|shēngbìng||to get sick
痛|痛|tòng||to hurt, ache
藥|药|yào||medicine
舒服|舒服|shūfú|shūfu|comfortable; feeling well
顏色|颜色|yánsè||color
紅|红|hóng||red
白|白|bái||white
黑|黑|hēi||black; dark
藍|蓝|lán||blue
綠|绿|lǜ||green
黃|黄|huáng||yellow
長|长|cháng||long
短|短|duǎn||short
舊|旧|jiù||old (not new)
一樣|一样|yíyàng||the same
錯|错|cuò||wrong; mistake
好玩|好玩|hǎowán||fun
有名|有名|yǒumíng||famous
乾淨|干净|gānjìng|gānjing|clean
安靜|安静|ānjìng||quiet
重要|重要|zhòngyào||important
簡單|简单|jiǎndān||simple, easy
容易|容易|róngyì||easy
方便|方便|fāngbiàn||convenient
年輕|年轻|niánqīng||young
老|老|lǎo||old (age)
可愛|可爱|kě'ài||cute
聰明|聪明|cōngmíng|cōngming|smart
好聽|好听|hǎotīng||nice to hear (a voice, a song)
奇怪|奇怪|qíguài||strange
怕|怕|pà||to be afraid of
擔心|担心|dānxīn||to worry
記得|记得|jìdé|jìde|to remember
忘|忘|wàng||to forget
試|试|shì||to try
換|换|huàn||to change, swap
參加|参加|cānjiā||to take part in, join
結婚|结婚|jiéhūn||to get married
見面|见面|jiànmiàn||to meet up
聊天|聊天|liáotiān||to chat
上網|上网|shàngwǎng||to go online
收到|收到|shōudào||to receive
關|关|guān||to close; to turn off
搬|搬|bān||to move (house); to carry
旅行|旅行|lǚxíng||to travel; a trip
照片|照片|zhàopiàn||photo
拍|拍|pāi||to take (a photo); to pat
畫|画|huà||to draw, paint; a painting
花|花|huā||flower; to spend
樹|树|shù||tree
山|山|shān||mountain
海|海|hǎi||sea, ocean
雪|雪|xuě||snow
風|风|fēng||wind
太陽|太阳|tàiyáng||sun
春天|春天|chūntiān||spring
夏天|夏天|xiàtiān||summer
秋天|秋天|qiūtiān||fall, autumn
冬天|冬天|dōngtiān||winter
而且|而且|érqiě||and also, what's more
如果|如果|rúguǒ||if
雖然|虽然|suīrán||although
或者|或者|huòzhě||or
然後|然后|ránhòu||then, after that
為了|为了|wèile||in order to, for
把|把|bǎ||(moves the object up front: 把門關上)
被|被|bèi||(was done by)
一下|一下|yíxià||a bit, for a moment
大概|大概|dàgài||probably, about
差不多|差不多|chàbùduō|chàbuduō|about, almost; about the same
這麼|这么|zhème||so, this (much)
那樣|那样|nàyàng||like that
哪個|哪个|nǎge||which one
啊|啊|a||(adds feeling: "oh", "ah")
只有|只有|zhǐyǒu||only"""
EX = {
"公司": [("你在哪個公司工作？","Which company do you work for?"),("我們公司很大。","Our company is big."),("他今天不在公司。","He's not at the office today.")],
"醫院": [("醫院在哪裡？","Where's the hospital?"),("她在醫院工作。","She works at a hospital."),("我要去醫院。","I need to go to the hospital.")],
"銀行": [("我要去銀行。","I need to go to the bank."),("銀行幾點開？","When does the bank open?"),("他在銀行工作。","He works at a bank.")],
"商店": [("這個商店賣什麼？","What does this store sell?"),("商店幾點開？","When does the store open?"),("那裡有很多商店。","There are lots of stores there.")],
"超市": [("我去超市買東西。","I'm going to the supermarket."),("超市很近。","The supermarket is close."),("超市有賣水果嗎？","Does the supermarket sell fruit?")],
"餐廳": [("這個餐廳很好吃。","This restaurant is good."),("我們去餐廳吃飯吧。","Let's eat at a restaurant."),("那個餐廳太貴了。","That restaurant is too expensive.")],
"公園": [("我們去公園走走吧。","Let's go for a walk in the park."),("公園裡有很多孩子。","There are lots of kids in the park."),("週末我們去公園。","We go to the park on weekends.")],
"圖書館": [("我在圖書館讀書。","I'm studying at the library."),("圖書館在學校裡。","The library is in the school."),("你常常去圖書館嗎？","Do you go to the library often?")],
"機場": [("我去機場。","I'm going to the airport."),("機場很遠嗎？","Is the airport far?"),("我在機場等你。","I'll wait for you at the airport.")],
"火車": [("我們坐火車去。","We'll take the train."),("火車幾點開？","When does the train leave?"),("火車比車快。","The train is faster than driving.")],
"站": [("火車站在哪裡？","Where's the train station?"),("下一站是哪裡？","What's the next stop?"),("別站在這裡。","Don't stand here.")],
"飛機": [("我坐飛機去台灣。","I'm flying to Taiwan."),("飛機幾點到？","When does the plane get in?"),("我沒有坐過飛機。","I've never flown.")],
"路": [("你知道路嗎？","Do you know the way?"),("我不知道路。","I don't know the way."),("路上很多車。","There's lots of traffic.")],
"左邊": [("銀行在左邊。","The bank is on the left."),("你左邊的人是誰？","Who's on your left?"),("坐左邊吧。","Sit on the left.")],
"右邊": [("學校在右邊。","The school is on the right."),("左邊還是右邊？","Left or right?"),("超市在銀行右邊。","The supermarket is to the right of the bank.")],
"前面": [("學校在前面。","The school is up ahead."),("你前面的人是誰？","Who's in front of you?"),("在銀行前面等我。","Wait for me in front of the bank.")],
"後面": [("他在我後面。","He's behind me."),("房子後面有一個公園。","There's a park behind the house."),("坐後面吧。","Sit in the back.")],
"旁邊": [("坐我旁邊吧。","Sit next to me."),("銀行旁邊有一個餐廳。","There's a restaurant next to the bank."),("我家旁邊就是超市。","The supermarket is right next to my home.")],
"外面": [("外面很冷。","It's cold outside."),("我們在外面吃吧。","Let's eat out."),("外面下雨了。","It's raining outside.")],
"上面": [("書在上面。","The book is on top."),("上面寫了什麼？","What's written on it?"),("電腦上面有一本書。","There's a book on the computer.")],
"下面": [("貓在下面。","The cat's underneath."),("下面是什麼？","What's below?"),("看下面。","Look below.")],
"頭": [("他的頭很大。","He has a big head."),("你的頭怎麼了？","What happened to your head?"),("頭上有什麼？","What's on your head?")],
"手": [("你洗手了嗎？","Did you wash your hands?"),("給我你的手。","Give me your hand."),("我的手很冷。","My hands are cold.")],
"眼睛": [("她的眼睛很漂亮。","She has beautiful eyes."),("我的眼睛很累。","My eyes are tired."),("你的眼睛怎麼了？","What's wrong with your eyes?")],
"身體": [("你身體好嗎？","How's your health?"),("運動對身體很好。","Exercise is good for you."),("爺爺身體很好。","Grandpa is in good health.")],
"生病": [("我生病了。","I'm sick."),("她生病了，所以不能來。","She's sick, so she can't come."),("別生病了！","Don't get sick!")],
"痛": [("我頭痛。","I have a headache."),("哪裡痛？","Where does it hurt?"),("我的手很痛。","My hand hurts.")],
"藥": [("你吃藥了嗎？","Did you take your medicine?"),("醫生給我藥。","The doctor gave me medicine."),("這個藥一天吃三次。","Take this medicine three times a day.")],
"舒服": [("我不舒服。","I don't feel well."),("這裡很舒服。","It's comfortable here."),("你哪裡不舒服？","What's bothering you?")],
"顏色": [("你喜歡什麼顏色？","What color do you like?"),("這個顏色很漂亮。","This color is lovely."),("有別的顏色嗎？","Do you have other colors?")],
"紅": [("我要紅的。","I want the red one."),("她穿紅的衣服。","She's in red."),("這個紅的多少錢？","How much is the red one?")],
"白": [("我喜歡白的。","I like the white one."),("紅的還是白的？","Red or white?"),("白的比較好看。","The white one looks better.")],
"黑": [("黑的比較好看。","The black one looks better."),("外面很黑。","It's dark outside."),("我要黑咖啡。","I'll have black coffee.")],
"藍": [("我喜歡藍的。","I like the blue one."),("天很藍。","The sky is very blue."),("你的手機是藍的嗎？","Is your phone blue?")],
"綠": [("我要綠的。","I want the green one."),("我要綠茶。","I'd like green tea."),("綠的好看。","The green one looks nice.")],
"黃": [("這個水果是黃的。","This fruit is yellow."),("我不喜歡黃的。","I don't like the yellow one."),("她穿黃的衣服。","She's wearing yellow.")],
"長": [("這個路很長。","This road is long."),("你的名字好長！","Your name is so long!"),("電影太長了。","The movie is too long.")],
"短": [("這個很短。","This one is short."),("這個電影很短。","This movie is short."),("時間很短。","There's not much time.")],
"舊": [("這是我的舊手機。","This is my old phone."),("我的電腦太舊了。","My computer is too old."),("舊的還是新的？","The old one or the new one?")],
"一樣": [("我們一樣高。","We're the same height."),("這兩個一樣嗎？","Are these two the same?"),("不一樣！","It's different!")],
"錯": [("你錯了。","You're wrong."),("對不起，是我的錯。","Sorry, my mistake."),("不錯！","Not bad!")],
"好玩": [("台灣很好玩。","Taiwan is a lot of fun."),("這個好玩嗎？","Is this fun?"),("我們去好玩的地方吧！","Let's go somewhere fun!")],
"有名": [("這個餐廳很有名。","This restaurant is famous."),("他是有名的醫生。","He's a famous doctor."),("台灣有名的東西是什麼？","What's Taiwan famous for?")],
"乾淨": [("這裡很乾淨。","It's very clean here."),("你的手乾淨嗎？","Are your hands clean?"),("洗乾淨了嗎？","Is it washed clean?")],
"安靜": [("請安靜！","Quiet, please!"),("圖書館很安靜。","The library is quiet."),("這個地方很安靜。","This place is peaceful.")],
"重要": [("這個很重要。","This is important."),("身體最重要。","Health comes first."),("不重要。","It doesn't matter.")],
"簡單": [("這個很簡單。","This is simple."),("中文沒有那麼簡單。","Chinese isn't that simple."),("簡單一點吧。","Keep it simple.")],
"容易": [("這個字很容易寫。","This character is easy to write."),("中文不容易。","Chinese isn't easy."),("說比做容易。","Easier said than done.")],
"方便": [("你明天方便嗎？","Is tomorrow good for you?"),("坐火車很方便。","The train is convenient."),("這裡買東西很方便。","Shopping is easy here.")],
"年輕": [("你很年輕！","You're young!"),("他比我年輕。","He's younger than me."),("年輕真好！","It's great to be young!")],
"老": [("我老了。","I'm getting old."),("爺爺很老了。","Grandpa is very old."),("老朋友！","Old friend!")],
"可愛": [("你的狗好可愛！","Your dog is so cute!"),("這個孩子真可愛。","This child is so cute."),("貓很可愛。","Cats are cute.")],
"聰明": [("你很聰明。","You're smart."),("她是一個聰明的學生。","She's a smart student."),("這個狗很聰明。","This dog is smart.")],
"好聽": [("這個音樂很好聽。","This music sounds great."),("你的名字很好聽。","Your name sounds lovely."),("她唱歌很好聽。","She sings beautifully.")],
"奇怪": [("真奇怪！","How strange!"),("他今天很奇怪。","He's acting weird today."),("這個字很奇怪。","This character is strange.")],
"怕": [("你怕狗嗎？","Are you afraid of dogs?"),("我不怕。","I'm not scared."),("她很怕冷。","She hates the cold.")],
"擔心": [("別擔心！","Don't worry!"),("我很擔心你。","I'm worried about you."),("媽媽常常擔心我。","Mom often worries about me.")],
"記得": [("你記得我嗎？","Do you remember me?"),("我不記得了。","I don't remember."),("記得喝水！","Remember to drink water!")],
"忘": [("我忘了！","I forgot!"),("別忘了帶手機。","Don't forget your phone."),("我忘了他的名字。","I forgot his name.")],
"試": [("我可以試一下嗎？","Can I try it?"),("你試試！","Give it a try!"),("我想試這個。","I want to try this one.")],
"換": [("我想換一個。","I'd like to swap it."),("你換衣服了嗎？","Did you change clothes?"),("我們換一個地方吧。","Let's go somewhere else.")],
"參加": [("你要參加嗎？","Are you joining?"),("我參加了考試。","I took the exam."),("很多人都參加了。","Lots of people took part.")],
"結婚": [("他們結婚了！","They got married!"),("你結婚了嗎？","Are you married?"),("我姐姐明年結婚。","My sister is getting married next year.")],
"見面": [("我們明天見面吧。","Let's meet up tomorrow."),("很高興跟你見面。","Great to meet you."),("我們在哪裡見面？","Where should we meet?")],
"聊天": [("我們聊天吧。","Let's chat."),("她在跟朋友聊天。","She's chatting with friends."),("我喜歡跟你聊天。","I like talking with you.")],
"上網": [("你每天上網嗎？","Are you online every day?"),("我在上網。","I'm online."),("這裡可以上網嗎？","Is there internet here?")],
"收到": [("你收到了嗎？","Did you get it?"),("我收到了，謝謝！","Got it, thanks!"),("我還沒有收到。","I haven't received it yet.")],
"關": [("請關手機。","Please turn off your phone."),("你可以關電腦嗎？","Can you turn off the computer?"),("商店關了。","The store is closed.")],
"搬": [("我們搬家了。","We moved."),("你要搬到哪裡？","Where are you moving to?"),("我幫你搬。","I'll help you carry it.")],
"旅行": [("你喜歡旅行嗎？","Do you like traveling?"),("我們去台灣旅行。","We're traveling to Taiwan."),("旅行很好玩。","Traveling is fun.")],
"照片": [("這是我家人的照片。","This is a photo of my family."),("你有照片嗎？","Do you have a photo?"),("這個照片很漂亮。","This photo is beautiful.")],
"拍": [("我可以拍照片嗎？","Can I take a photo?"),("你拍得很好。","You take great photos."),("我們一起拍吧！","Let's take one together!")],
"畫": [("你會畫畫嗎？","Can you draw?"),("她畫得很漂亮。","She paints beautifully."),("這是我女兒畫的。","My daughter drew this.")],
"花": [("這個花很漂亮。","This flower is pretty."),("我買花送你。","I bought you flowers."),("你花了多少錢？","How much did you spend?")],
"樹": [("公園裡有很多樹。","There are lots of trees in the park."),("那個樹很高。","That tree is tall."),("樹下很舒服。","It's nice under the tree.")],
"山": [("我們去山上吧。","Let's go up the mountain."),("台灣有很多山。","Taiwan has lots of mountains."),("那個山很高。","That mountain is high.")],
"海": [("我想去看海。","I want to go see the ocean."),("台灣的海很漂亮。","Taiwan's sea is beautiful."),("你喜歡山還是海？","Do you prefer mountains or the sea?")],
"雪": [("台灣有雪嗎？","Does it snow in Taiwan?"),("我沒有看過雪。","I've never seen snow."),("山上有雪。","There's snow on the mountain.")],
"風": [("今天風很大。","It's windy today."),("外面有風。","There's a breeze outside."),("風太大了！","The wind's too strong!")],
"太陽": [("太陽出來了。","The sun's out."),("今天太陽很大。","The sun is strong today."),("我喜歡太陽。","I love the sun.")],
"春天": [("春天來了！","Spring is here!"),("我最喜歡春天。","Spring is my favorite."),("春天的花很漂亮。","Spring flowers are lovely.")],
"夏天": [("夏天很熱。","Summer is hot."),("夏天我們去游泳。","We go swimming in summer."),("台灣的夏天很長。","Summer in Taiwan is long.")],
"秋天": [("秋天很舒服。","Fall is pleasant."),("我喜歡秋天。","I like fall."),("秋天的天氣最好。","Fall has the best weather.")],
"冬天": [("冬天很冷。","Winter is cold."),("冬天你去哪裡？","Where do you go in winter?"),("今年冬天下雪了。","It snowed this winter.")],
"而且": [("這個便宜，而且很好吃。","It's cheap, and it's good."),("她很聰明，而且很漂亮。","She's smart, and pretty too."),("我很累，而且很餓。","I'm tired, and hungry too.")],
"如果": [("如果下雨，我們就不去了。","If it rains, we won't go."),("如果你有時間，來我家吧。","If you have time, come over."),("如果我是你，我會去。","If I were you, I'd go.")],
"雖然": [("雖然很貴，但是很好。","It's expensive, but it's good."),("雖然下雨，他還是來了。","He came even though it was raining."),("雖然中文很難，我很喜歡。","Chinese is hard, but I love it.")],
"或者": [("我們明天或者週末去。","We'll go tomorrow or on the weekend."),("喝茶或者咖啡都可以。","Tea or coffee, either is fine."),("你可以打電話或者上網。","You can call or go online.")],
"然後": [("我們吃飯，然後看電影。","We'll eat, then see a movie."),("我起床，然後洗澡。","I get up, then shower."),("然後呢？","And then?")],
"為了": [("為了你，我什麼都做。","I'd do anything for you."),("我學中文是為了去台灣。","I'm learning Chinese so I can go to Taiwan."),("為了身體，我每天運動。","I work out every day for my health.")],
"把": [("把水給我。","Pass me the water."),("把手機給我。","Hand me the phone."),("你把我的書放在哪裡了？","Where did you put my book?")],
"被": [("我的手機被拿走了。","My phone got taken."),("他被老師說了。","He got told off by the teacher."),("我的咖啡被他喝了。","He drank my coffee.")],
"一下": [("等一下！","Wait a sec!"),("我看一下。","Let me take a look."),("你可以幫我一下嗎？","Can you give me a hand?")],
"大概": [("大概十分鐘。","About ten minutes."),("他大概不來了。","He's probably not coming."),("大概多少錢？","Roughly how much?")],
"差不多": [("差不多了。","That's about it."),("我們差不多高。","We're about the same height."),("差不多十點了。","It's almost ten.")],
"這麼": [("你怎麼這麼高？","How are you so tall?"),("今天這麼冷！","It's so cold today!"),("這麼多人！","So many people!")],
"那樣": [("別那樣說。","Don't say it like that."),("我也想那樣。","I want to be like that too."),("那樣不好。","That's not good.")],
"哪個": [("你要哪個？","Which one do you want?"),("哪個好？","Which one is better?"),("你是哪個學校的？","Which school do you go to?")],
"啊": [("好啊！","Sure!"),("你好啊！","Hi there!"),("真的啊？","Really?")],
"只有": [("我只有一個。","I only have one."),("只有你知道。","Only you know."),("這裡只有我們。","It's just us here.")],
}
