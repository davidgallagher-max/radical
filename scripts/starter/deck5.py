# Starter 5: words 401 to 500. (trad|simp|tw pinyin|cn pinyin or ""|meaning), then sentences that use only words so far.
W = """國家|国家|guójiā||country
城市|城市|chéngshì||city
世界|世界|shìjiè||world
語言|语言|yǔyán||language
英文|英文|Yīngwén||English
日本|日本|Rìběn||Japan
外國|外国|wàiguó||foreign country; foreign
回來|回来|huílái|huílai|to come back
回去|回去|huíqù|huíqu|to go back
出來|出来|chūlái|chūlai|to come out
起來|起来|qǐlái|qǐlai|to get up; (starting, seeming: 看起來)
下來|下来|xiàlái|xiàlai|to come down
經理|经理|jīnglǐ||manager
老闆|老板|lǎobǎn||boss, owner
同事|同事|tóngshì||coworker
客人|客人|kèrén||guest; customer
警察|警察|jǐngchá||police officer
鄰居|邻居|línjū||neighbor
男朋友|男朋友|nánpéngyǒu|nánpéngyou|boyfriend
女朋友|女朋友|nǚpéngyǒu|nǚpéngyou|girlfriend
快樂|快乐|kuàilè||happy
生日|生日|shēngrì||birthday
禮物|礼物|lǐwù||gift, present
新年|新年|xīnnián||New Year
錢包|钱包|qiánbāo||wallet
鑰匙|钥匙|yàoshi||key
門|门|mén||door
窗戶|窗户|chuānghù|chuānghu|window
桌子|桌子|zhuōzi||table, desk
椅子|椅子|yǐzi||chair
床|床|chuáng||bed
房間|房间|fángjiān||room
廁所|厕所|cèsuǒ||restroom, toilet
廚房|厨房|chúfáng||kitchen
冰箱|冰箱|bīngxiāng||fridge
杯子|杯子|bēizi||cup, glass
筷子|筷子|kuàizi||chopsticks
碗|碗|wǎn||bowl
新聞|新闻|xīnwén||news
消息|消息|xiāoxí|xiāoxi|news (about someone); message
故事|故事|gùshì|gùshi|story
歷史|历史|lìshǐ||history
文化|文化|wénhuà||culture
興趣|兴趣|xìngqù||interest (in something)
習慣|习惯|xíguàn||habit; to be used to
機會|机会|jīhuì||chance, opportunity
辦法|办法|bànfǎ||way (to do something), solution
原因|原因|yuányīn||reason
地圖|地图|dìtú||map
護照|护照|hùzhào||passport
行李|行李|xínglǐ|xíngli|luggage
飯店|饭店|fàndiàn||hotel; restaurant
菜單|菜单|càidān||menu
點菜|点菜|diǎncài||to order food
付|付|fù||to pay
排隊|排队|páiduì||to stand in line
開車|开车|kāichē||to drive
停|停|tíng||to stop; to park
小心|小心|xiǎoxīn||careful; be careful
危險|危险|wéixiǎn||dangerous
安全|安全|ānquán||safe
幫忙|帮忙|bāngmáng||to help out
不客氣|不客气|búkèqì|búkèqi|you're welcome
沒關係|没关系|méiguānxì|méiguānxi|it's OK, never mind
歡迎|欢迎|huānyíng||welcome
恭喜|恭喜|gōngxǐ||congratulations
加油|加油|jiāyóu||go for it!, keep going!
祝|祝|zhù||to wish (someone something)
辛苦|辛苦|xīnkǔ||hard, tiring (thanks for your hard work)
麻煩|麻烦|máfán|máfan|trouble; to trouble (someone)
放心|放心|fàngxīn||to rest easy, not worry
相信|相信|xiāngxìn||to believe
同意|同意|tóngyì||to agree
發現|发现|fāxiàn||to find, discover
了解|了解|liǎojiě||to understand, know well
選|选|xuǎn||to choose
改|改|gǎi||to change, fix
完|完|wán||to finish; done
成功|成功|chénggōng||to succeed; success
努力|努力|nǔlì||to work hard
進步|进步|jìnbù||to improve; progress
複習|复习|fùxí||to review (lessons)
聲音|声音|shēngyīn||sound; voice
句子|句子|jùzi||sentence
生詞|生词|shēngcí||new word (in a lesson)
意見|意见|yìjiàn||opinion
方法|方法|fāngfǎ||method, way
全部|全部|quánbù||all, the whole thing
終於|终于|zhōngyú||finally, at last
突然|突然|túrán||suddenly
剛才|刚才|gāngcái||just now
以為|以为|yǐwéi||to think (wrongly), assume
正在|正在|zhèngzài||(right now) in the middle of
還有|还有|háiyǒu||and also; there's still
第|第|dì||(makes a number an order: 第二 second)
最後|最后|zuìhòu||last; finally
開心|开心|kāixīn||happy, having fun
難過|难过|nánguò||sad
感覺|感觉|gǎnjué||to feel; a feeling
一直|一直|yìzhí||all along, the whole time; straight"""
EX = {
"國家": [("你去過幾個國家？","How many countries have you been to?"),("這是一個很大的國家。","It's a big country."),("你最喜歡哪個國家？","Which country do you like best?")],
"城市": [("我喜歡這個城市。","I like this city."),("台灣有很多大城市。","Taiwan has many big cities."),("你住在哪個城市？","Which city do you live in?")],
"世界": [("世界很大。","The world is big."),("我想去看世界。","I want to see the world."),("這是世界上最好的咖啡！","This is the best coffee in the world!")],
"語言": [("你會說幾個語言？","How many languages do you speak?"),("中文是一個很有意思的語言。","Chinese is a fascinating language."),("學語言需要時間。","Learning a language takes time.")],
"英文": [("你會說英文嗎？","Do you speak English?"),("這個字英文怎麼說？","How do you say this word in English?"),("她教英文。","She teaches English.")],
"日本": [("我去年去了日本。","I went to Japan last year."),("日本菜很好吃。","Japanese food is delicious."),("他是日本人。","He's Japanese.")],
"外國": [("我想去外國工作。","I want to work abroad."),("他是外國人。","He's a foreigner."),("這是外國的東西。","This is from abroad.")],
"回來": [("你什麼時候回來？","When are you coming back?"),("我回來了！","I'm back!"),("他還沒有回來。","He's not back yet.")],
"回去": [("我要回去了。","I have to head back."),("你明天回去嗎？","Are you going back tomorrow?"),("我們回去吧。","Let's go back.")],
"出來": [("你出來一下。","Come out for a sec."),("太陽出來了。","The sun's come out."),("我在外面，你出來吧。","I'm outside, come on out.")],
"起來": [("起來！","Get up!"),("這個看起來很好吃。","This looks delicious."),("你看起來很累。","You look tired.")],
"下來": [("你下來吧。","Come on down."),("他從山上下來了。","He came down the mountain."),("坐下來休息一下。","Sit down and rest a bit.")],
"經理": [("我們經理很好。","Our manager is nice."),("經理在嗎？","Is the manager in?"),("她是這個餐廳的經理。","She's the manager of this restaurant.")],
"老闆": [("老闆，多少錢？","How much, boss?"),("我的老闆很忙。","My boss is very busy."),("他是這個商店的老闆。","He owns this store.")],
"同事": [("他是我的同事。","He's my coworker."),("我跟同事一起吃午餐。","I have lunch with my coworkers."),("我的同事都很好。","My coworkers are all great.")],
"客人": [("今天有很多客人。","There are lots of customers today."),("我們家有客人。","We have guests."),("客人來了！","The guests are here!")],
"警察": [("我要找警察。","I need the police."),("警察來了。","The police are here."),("他爸爸是警察。","His dad is a police officer.")],
"鄰居": [("我的鄰居很好。","My neighbors are nice."),("他是我們的新鄰居。","He's our new neighbor."),("鄰居的狗很可愛。","The neighbors' dog is cute.")],
"男朋友": [("你有男朋友嗎？","Do you have a boyfriend?"),("這是我男朋友。","This is my boyfriend."),("她男朋友是台灣人。","Her boyfriend is Taiwanese.")],
"女朋友": [("他的女朋友很漂亮。","His girlfriend is beautiful."),("你女朋友叫什麼名字？","What's your girlfriend's name?"),("我沒有女朋友。","I don't have a girlfriend.")],
"快樂": [("我很快樂。","I'm happy."),("他是一個快樂的人。","He's a happy person."),("跟朋友在一起很快樂。","Being with friends makes me happy.")],
"生日": [("生日快樂！","Happy birthday!"),("你的生日是幾月幾號？","When's your birthday?"),("今天是我的生日！","Today's my birthday!")],
"禮物": [("這是給你的禮物。","This is a present for you."),("謝謝你的禮物！","Thanks for the gift!"),("我要買生日禮物。","I need to buy a birthday present.")],
"新年": [("新年快樂！","Happy New Year!"),("新年你要去哪裡？","Where are you going for New Year?"),("新年我回家。","I go home for New Year.")],
"錢包": [("我的錢包呢？","Where's my wallet?"),("我忘了帶錢包。","I forgot my wallet."),("這是誰的錢包？","Whose wallet is this?")],
"鑰匙": [("你有鑰匙嗎？","Do you have the key?"),("我找不到鑰匙。","I can't find my keys."),("鑰匙在我這裡。","I've got the key.")],
"門": [("請關門。","Please close the door."),("門開了。","The door's open."),("門外面有人。","There's someone at the door.")],
"窗戶": [("請開窗戶。","Please open the window."),("把窗戶關上。","Close the window."),("窗戶外面有花。","There are flowers outside the window.")],
"桌子": [("書在桌子上。","The book is on the table."),("這個桌子很大。","This table is big."),("這個桌子是新的。","This table is new.")],
"椅子": [("請坐這個椅子。","Have this chair."),("這裡沒有椅子。","There are no chairs here."),("椅子太小了。","The chair's too small.")],
"床": [("我想在床上休息。","I want to rest in bed."),("這個床很舒服。","This bed is comfortable."),("貓在床下面。","The cat's under the bed.")],
"房間": [("這是我的房間。","This is my room."),("你的房間很乾淨。","Your room is tidy."),("房間裡有一個床。","There's a bed in the room.")],
"廁所": [("請問，廁所在哪裡？","Excuse me, where's the restroom?"),("我要去廁所。","I need the restroom."),("廁所在後面。","The restroom's in the back.")],
"廚房": [("媽媽在廚房。","Mom's in the kitchen."),("廚房很小。","The kitchen is small."),("我在廚房做菜。","I'm cooking in the kitchen.")],
"冰箱": [("冰箱裡有什麼？","What's in the fridge?"),("牛奶在冰箱裡。","The milk's in the fridge."),("冰箱裡沒有東西了。","The fridge is empty.")],
"杯子": [("這是誰的杯子？","Whose cup is this?"),("給我一個杯子。","Give me a cup."),("杯子在廚房。","The cups are in the kitchen.")],
"筷子": [("你會用筷子嗎？","Can you use chopsticks?"),("我需要筷子。","I need chopsticks."),("筷子在桌子上。","The chopsticks are on the table.")],
"碗": [("我要一碗麵。","I'd like a bowl of noodles."),("他吃了兩碗飯。","He ate two bowls of rice."),("碗在哪裡？","Where are the bowls?")],
"新聞": [("你看新聞了嗎？","Did you see the news?"),("今天有什麼新聞？","What's in the news today?"),("我每天早上看新聞。","I read the news every morning.")],
"消息": [("有消息嗎？","Any news?"),("這是好消息！","That's good news!"),("我還沒有他的消息。","I haven't heard from him yet.")],
"故事": [("跟我說一個故事吧。","Tell me a story."),("這個故事很有意思。","This story is interesting."),("孩子喜歡聽故事。","Kids love stories.")],
"歷史": [("台灣的歷史很有意思。","Taiwan's history is fascinating."),("我喜歡歷史。","I like history."),("這個城市有很長的歷史。","This city has a long history.")],
"文化": [("我喜歡中國文化。","I like Chinese culture."),("每個國家的文化不一樣。","Every country's culture is different."),("台灣文化很有意思。","Taiwanese culture is fascinating.")],
"興趣": [("你有什麼興趣？","What are your interests?"),("我對音樂很有興趣。","I'm really into music."),("他對運動沒有興趣。","He's not interested in sports.")],
"習慣": [("你習慣了嗎？","Are you used to it yet?"),("我還不習慣。","I'm still not used to it."),("這是好習慣。","That's a good habit.")],
"機會": [("這是一個好機會。","This is a good opportunity."),("我沒有機會說中文。","I don't get a chance to speak Chinese."),("下次還有機會。","There'll be another chance.")],
"辦法": [("我沒有辦法。","There's nothing I can do."),("你有什麼辦法？","Got any ideas?"),("這是一個好辦法。","That's a good way to do it.")],
"原因": [("原因是什麼？","What's the reason?"),("我不知道原因。","I don't know why."),("這就是原因。","That's the reason.")],
"地圖": [("你有地圖嗎？","Do you have a map?"),("看一下地圖。","Take a look at the map."),("我在手機上看地圖。","I check the map on my phone.")],
"護照": [("我的護照呢？","Where's my passport?"),("請給我你的護照。","Your passport, please."),("別忘了帶護照！","Don't forget your passport!")],
"行李": [("你的行李多不多？","Do you have much luggage?"),("我幫你拿行李。","Let me get your bags."),("我的行李還沒有到。","My luggage hasn't arrived.")],
"飯店": [("我們住在哪個飯店？","Which hotel are we staying at?"),("這個飯店很舒服。","This hotel is comfortable."),("飯店在機場旁邊。","The hotel is next to the airport.")],
"菜單": [("請給我菜單。","The menu, please."),("菜單上有什麼？","What's on the menu?"),("我看不懂菜單。","I can't read the menu.")],
"點菜": [("你們要點菜了嗎？","Are you ready to order?"),("你來點菜吧。","You order."),("我們點菜吧。","Let's order.")],
"付": [("我來付。","I'll pay."),("你付了嗎？","Did you pay?"),("可以用手機付嗎？","Can I pay with my phone?")],
"排隊": [("請排隊。","Please line up."),("很多人在排隊。","Lots of people are in line."),("排隊的人很多。","The line is long.")],
"開車": [("你會開車嗎？","Can you drive?"),("我開車去公司。","I drive to work."),("我不會開車。","I can't drive.")],
"停": [("停！","Stop!"),("請在這裡停。","Please stop here."),("車停在哪裡？","Where's the car parked?")],
"小心": [("小心！","Look out!"),("開車要小心。","Drive carefully."),("小心，很熱！","Careful, it's hot!")],
"危險": [("這裡很危險。","It's dangerous here."),("別去，太危險了！","Don't go, it's too dangerous!"),("晚上一個人走路危險嗎？","Is it dangerous to walk alone at night?")],
"安全": [("這裡安全嗎？","Is it safe here?"),("台灣很安全。","Taiwan is very safe."),("安全最重要。","Safety comes first.")],
"幫忙": [("謝謝你幫忙！","Thanks for your help!"),("要我幫忙嗎？","Need a hand?"),("我可以幫忙。","I can help.")],
"不客氣": [("謝謝！不客氣。","Thanks! You're welcome."),("不客氣，這是我應該做的。","You're welcome. It's the least I could do."),("不客氣，有問題再問我。","You're welcome. Ask me anytime.")],
"沒關係": [("對不起！沒關係。","Sorry! It's OK."),("沒關係，你慢慢來。","No worries, take your time."),("錯了也沒關係。","It's fine to make mistakes.")],
"歡迎": [("歡迎！","Welcome!"),("歡迎來台灣！","Welcome to Taiwan!"),("歡迎你們來我家。","You're all welcome at my place.")],
"恭喜": [("恭喜你！","Congratulations!"),("恭喜你們結婚了！","Congratulations on getting married!"),("恭喜你找到工作了！","Congrats on the new job!")],
"加油": [("加油！","You can do it!"),("考試加油！","Good luck on the test!"),("我們一起加油！","Let's keep at it together!")],
"祝": [("祝你生日快樂！","Happy birthday to you!"),("祝你們新年快樂！","Happy New Year to you all!"),("祝你週末快樂！","Have a great weekend!")],
"辛苦": [("辛苦了！","Thanks for all your hard work!"),("工作很辛苦。","Work is hard."),("你今天辛苦了。","You've had a long day.")],
"麻煩": [("麻煩你了。","Sorry for the trouble."),("這個很麻煩。","This is a hassle."),("麻煩你幫我一下。","Could you give me a hand?")],
"放心": [("你放心吧。","Don't worry."),("我不放心。","I'm still worried."),("有你在，我很放心。","With you here, I feel safe.")],
"相信": [("我相信你。","I believe in you."),("你相信嗎？","Do you believe it?"),("我不相信他。","I don't trust him.")],
"同意": [("我同意。","I agree."),("你同意嗎？","Do you agree?"),("媽媽不同意。","Mom doesn't agree.")],
"發現": [("我發現了一個好餐廳。","I found a great restaurant."),("你發現了嗎？","Did you notice?"),("我發現中文沒有那麼難。","I found Chinese isn't that hard.")],
"了解": [("我了解。","I understand."),("你了解他嗎？","Do you know him well?"),("我想了解台灣的文化。","I want to get to know Taiwan's culture.")],
"選": [("你選哪個？","Which one do you pick?"),("我選這個。","I'll take this one."),("你自己選吧。","You choose.")],
"改": [("我改了。","I fixed it."),("你可以改一下嗎？","Can you change it?"),("時間改了。","The time has changed.")],
"完": [("我吃完了。","I'm done eating."),("你看完了嗎？","Have you finished it?"),("功課寫完了！","Homework's done!")],
"成功": [("我們成功了！","We did it!"),("祝你成功！","Good luck!"),("他很成功。","He's very successful.")],
"努力": [("我會努力的。","I'll work hard."),("他學中文很努力。","He studies Chinese hard."),("努力就會成功。","Work hard and you'll succeed.")],
"進步": [("你的中文進步了！","Your Chinese has improved!"),("我每天都有一點進步。","I get a little better every day."),("進步很快！","You're improving fast!")],
"複習": [("我在複習今天的課。","I'm reviewing today's lesson."),("考試以前要複習。","Review before the test."),("我們一起複習吧。","Let's review together.")],
"聲音": [("你聽到聲音了嗎？","Did you hear that?"),("她的聲音很好聽。","She has a lovely voice."),("聲音太大了。","It's too loud.")],
"句子": [("這個句子是什麼意思？","What does this sentence mean?"),("請說一個句子。","Please say a sentence."),("這個句子太長了。","This sentence is too long.")],
"生詞": [("今天有很多生詞。","There are lots of new words today."),("這個生詞我不認識。","I don't know this new word."),("我每天學十個生詞。","I learn ten new words a day.")],
"意見": [("你有什麼意見？","What do you think?"),("我沒有意見。","I'm fine with it."),("我想聽你的意見。","I'd like your opinion.")],
"方法": [("這是最好的方法。","This is the best way."),("你有什麼好方法？","Got a good way to do it?"),("學中文的方法很多。","There are many ways to learn Chinese.")],
"全部": [("我全部吃完了。","I ate it all."),("全部多少錢？","How much for everything?"),("全部都是我的。","It's all mine.")],
"終於": [("你終於來了！","You're finally here!"),("我終於懂了。","I finally get it."),("考試終於完了！","The exam is finally over!")],
"突然": [("突然下雨了。","It suddenly started raining."),("他突然走了。","He suddenly left."),("她突然笑了。","She suddenly laughed.")],
"剛才": [("你剛才說什麼？","What did you just say?"),("他剛才在這裡。","He was here just now."),("我剛才吃了。","I just ate.")],
"以為": [("我以為你不來了。","I thought you weren't coming."),("他以為我是老師。","He thought I was a teacher."),("我以為很難。","I thought it would be hard.")],
"正在": [("我正在吃飯。","I'm eating right now."),("她正在打電話。","She's on the phone."),("我們正在等你。","We're waiting for you.")],
"還有": [("還有問題嗎？","Any more questions?"),("我要咖啡，還有一個麵包。","I'd like a coffee, and a bread roll."),("還有五分鐘。","Five more minutes.")],
"第": [("這是我第三次來台灣。","This is my third time in Taiwan."),("他是第二個來的。","He was the second to arrive."),("這是第五課。","This is lesson five.")],
"最後": [("最後一個！","Last one!"),("最後，他回家了。","In the end, he went home."),("我是最後一個到的。","I was the last to arrive.")],
"開心": [("我今天很開心。","I had a great time today."),("你開心嗎？","Are you happy?"),("跟你在一起很開心。","I'm happy when I'm with you.")],
"難過": [("別難過。","Don't be sad."),("我很難過。","I'm really sad."),("她為什麼難過？","Why is she sad?")],
"感覺": [("你感覺怎麼樣？","How do you feel?"),("我感覺好一點了。","I feel a bit better."),("這個感覺很好。","This feels great.")],
"一直": [("一直走。","Go straight."),("他一直在說話。","He keeps talking."),("我一直想去台灣。","I've always wanted to go to Taiwan.")],
}
