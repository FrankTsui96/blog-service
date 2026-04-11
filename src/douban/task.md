# 从豆瓣获取图书信息接口

帮我写一个接口，使用豆瓣的两个现有的接口，获取到图书的标题，出版时间等信息。

## 使用到的豆瓣接口

一共两个接口，都是返回 html 文件。

1. 使用 ISBN 搜索图书列表接口，获取到查询结果，接口 curl 如下：

   ```
   curl --location 'https://www.douban.com/search?cat=1001&q={ISBN}'
   ```

2. 从返回值中找到元素 `div.result-list` 下的第一个 `div.result`，返回内容样例：

   ```html
   <div class="result">
     <div class="pic">
       <a
         class="nbg"
         href="https://www.douban.com/link2/?url=https%3A%2F%2Fbook.douban.com%2Fsubject%2F26977116%2F&amp;query=9787101115970&amp;cat_id=1001&amp;type=search&amp;pos=0"
         target="_blank"
         onclick="moreurl(this,{i: '0', query: '9787101115970', from: 'dou_search_book', sid: 26977116, qcat: '1001'})"
         title="春秋左传注"
         ><img
           src="https://img9.doubanio.com/view/subject/s/public/s33543046.jpg"
       /></a>
     </div>
     <div class="content">
       <div class="title">
         <h3>
           <span>[书籍]</span>&nbsp;<a
             href="https://www.douban.com/link2/?url=https%3A%2F%2Fbook.douban.com%2Fsubject%2F26977116%2F&amp;query=9787101115970&amp;cat_id=1001&amp;type=search&amp;pos=0"
             target="_blank"
             onclick="moreurl(this,{i: '0', query: '9787101115970', from: 'dou_search_book', sid: 26977116, qcat: '1001'})"
             >春秋左传注
           </a>
         </h3>

         <div class="rating-info">
           <span class="allstar50"></span>
           <span class="rating_nums">9.8</span>
           <span>(658人评价)</span>

           <span class="subject-cast">杨伯峻 / 中华书局 / 2017</span>
         </div>
       </div>
       <p>
         《春秋左传》是我国现存极早的编年体史书，记事翔实，文辞优美，是学习、研究先秦历史、文学、哲学和语言的必读典籍。作者广泛收集有关文献考古资料，充分汲取古今学者...
       </p>
     </div>
   </div>
   ```

3. 取得元素 `a.nbg` 的属性 `onclick` 的参数 `sid`，作为 target_id，继续调用详情查询接口。

4. 使用详情查询接口，取得图书详情页面的 html，接口 curl 如下：

   ```
   curl --location 'https://book.douban.com/subject/{target_id}'
   ```

5. 从返回值中找到元素 `div#info`，返回内容样例：

   ```html
   <div id="info" class="">
     <span>
       <span class="pl"> 作者</span>:

       <a class="" href="/search/%E6%9D%A8%E4%BC%AF%E5%B3%BB">杨伯峻</a> </span
     ><br />

     <span class="pl">出版社:</span>
     <a href="https://book.douban.com/press/2838">中华书局</a>
     <br />

     <span class="pl">出版年:</span> 2017-1<br />

     <span class="pl">ISBN:</span> 9787101115970<br />

     <span class="pl">页数:</span> 1940<br />

     <span class="pl">装帧:</span> 平装<br />

     <span class="pl">定价:</span> 198元<br />

     <span class="pl">丛书:</span>&nbsp;<a
       href="https://book.douban.com/series/1124"
       >中国古典名著译注丛书</a
     ><br />
   </div>
   ```

6. 返回一个对象，key 参照 `span.pl` 中的文本，value 参照后面的文本，如：

   ```typescript
   const info = {
     author: '杨伯峻',
     // ...
   };
   ```
