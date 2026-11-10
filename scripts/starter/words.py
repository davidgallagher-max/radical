# (trad, simp, tw pinyin, cn pinyin or "", meaning)
W = """我|我|wǒ||I, me
你|你|nǐ||you
好|好|hǎo||good, well
是|是|shì||to be; yes
不|不|bù||not, no
他|他|tā||he, him
她|她|tā||she, her
很|很|hěn||very
嗎|吗|ma||(makes a question)
的|的|de||'s, of (belonging)
人|人|rén||person, people
有|有|yǒu||to have; there is
沒有|没有|méiyǒu||not have; there isn't; didn't
這|这|zhè||this
那|那|nà||that; then
個|个|ge||(measure word for people and things)
什麼|什么|shénme||what
一|一|yī||one
二|二|èr||two
三|三|sān||three
中文|中文|Zhōngwén||Chinese (language)
說|说|shuō||to speak, say
會|会|huì||can (know how); will
想|想|xiǎng||to want to; to think; to miss
要|要|yào||to want; to need; will
去|去|qù||to go
來|来|lái||to come
在|在|zài||at, in; to be (somewhere); -ing
哪裡|哪里|nǎlǐ||where
家|家|jiā||home, family
吃|吃|chī||to eat
喝|喝|hē||to drink
水|水|shuǐ||water
茶|茶|chá||tea
飯|饭|fàn||rice, meal
了|了|le||(done; a change)
我們|我们|wǒmen||we, us
你們|你们|nǐmen||you (more than one)
他們|他们|tāmen||they, them
也|也|yě||also, too
都|都|dōu||all, both
和|和|hé||and, with
朋友|朋友|péngyǒu|péngyou|friend
老師|老师|lǎoshī||teacher
學生|学生|xuéshēng|xuésheng|student
學|学|xué||to study, learn
看|看|kàn||to look, watch, read
書|书|shū||book
大|大|dà||big
小|小|xiǎo||small, little
多|多|duō||many, much, more
到|到|dào||to arrive; to, until
今天|今天|jīntiān||today
明天|明天|míngtiān||tomorrow
昨天|昨天|zuótiān||yesterday
現在|现在|xiànzài||now
時間|时间|shíjiān||time
年|年|nián||year
點|点|diǎn||o'clock; a little
四|四|sì||four
五|五|wǔ||five
十|十|shí||ten
幾|几|jǐ||how many (small numbers)
多少|多少|duōshǎo||how many, how much
錢|钱|qián||money
買|买|mǎi||to buy
東西|东西|dōngxī|dōngxi|thing, stuff
喜歡|喜欢|xǐhuān|xǐhuan|to like
愛|爱|ài||to love
做|做|zuò||to do, make
工作|工作|gōngzuò||work, job; to work
叫|叫|jiào||to be called; to call
名字|名字|míngzì|míngzi|name
誰|谁|shéi||who
為什麼|为什么|wèishénme||why
因為|因为|yīnwèi||because
可以|可以|kěyǐ||can, may
知道|知道|zhīdào|zhīdao|to know
上|上|shàng||up, on; to go up; last
下|下|xià||down, under; to go down; next
裡|里|lǐ||in, inside
再|再|zài||again; then
再見|再见|zàijiàn||goodbye
謝謝|谢谢|xièxie||thank you
對|对|duì||right, correct; to, toward
對不起|对不起|duìbùqǐ|duìbuqǐ|sorry
先生|先生|xiānshēng|xiānsheng|Mr., sir; husband
媽媽|妈妈|māma||mom
爸爸|爸爸|bàba||dad
孩子|孩子|háizi||child
狗|狗|gǒu||dog
貓|猫|māo||cat
走|走|zǒu||to walk; to leave
回|回|huí||to go back, return
車|车|chē||car
開|开|kāi||to open; to drive
太|太|tài||too (much)
熱|热|rè||hot
冷|冷|lěng||cold
就|就|jiù||just, right then; exactly"""
WORDS = [dict(zip(["t","s","tw","cn","en"], l.split("|"))) for l in W.split("\n")]
