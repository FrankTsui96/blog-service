import { Injectable, BadRequestException } from '@nestjs/common';
import * as cheerio from 'cheerio';

export interface DoubanBookInfo {
  [key: string]: string;
}

@Injectable()
export class DoubanService {
  /**
   * 中文 key 到英文 key 的映射
   */
  private readonly keyMap: Record<string, string> = {
    作者: 'author',
    出版社: 'publisher',
    出版年: 'publishYear',
    ISBN: 'isbn',
    页数: 'pages',
    装帧: 'binding',
    定价: 'price',
    丛书: 'series',
    副标题: 'subtitle',
    原作名: 'originalTitle',
    译者: 'translator',
    出版年月: 'publishDate',
  };

  /**
   * 分类编码
   */
  private readonly cateMap = {
    book: '1001',
    movie: '1002',
  };

  /**
   * 通过 ISBN 从豆瓣获取图书信息
   * 1. 搜索接口获取 target_id
   * 2. 详情页解析 div#info
   */
  async getBookInfoByISBN(isbn: string): Promise<DoubanBookInfo> {
    const targetId = await this.searchBookByISBN(isbn);
    const html = await this.fetchBookDetail(targetId);
    return this.parseBookInfo(html);
  }

  /** 调用豆瓣搜索页，解析 HTML 获取 target_id（sid） */
  private async searchBookByISBN(isbn: string): Promise<string> {
    const url = `https://www.douban.com/search?cat=${this.cateMap.book}&q=${encodeURIComponent(isbn)}`;
    console.log(url);
    const res = await fetch(url);

    if (!res.ok) {
      throw new BadRequestException(`豆瓣搜索页请求失败: ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // 取 div.result-list 下第一个 div.result 中的 a.nbg
    const firstResult = $('div.result-list div.result').first();
    const onclick = firstResult.find('a.nbg').attr('onclick');

    if (!onclick) {
      throw new BadRequestException('未找到对应图书，请检查 ISBN');
    }

    // 从 onclick 中提取 sid，格式如: moreurl(this,{..., sid: 26977116, ...})
    const sidMatch = onclick.match(/sid:\s*(\d+)/);
    if (!sidMatch) {
      throw new BadRequestException('未找到对应图书，请检查 ISBN');
    }

    return sidMatch[1];
  }

  /** 获取图书详情页 HTML */
  private async fetchBookDetail(targetId: string): Promise<string> {
    const url = `https://book.douban.com/subject/${targetId}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new BadRequestException(`豆瓣详情页请求失败: ${res.status}`);
    }

    return res.text();
  }

  /** 解析详情页 HTML 中 div#info 的内容 */
  private parseBookInfo(html: string): DoubanBookInfo {
    const $ = cheerio.load(html);
    const infoDiv = $('#info');

    if (!infoDiv.length) {
      throw new BadRequestException('未找到图书信息');
    }

    const info: DoubanBookInfo = {};

    const htmlContent = infoDiv.html() || '';

    // 将 <br> 分割的每一行当作一条记录
    const lines = htmlContent.split(/<br\s*\/?>/);

    for (const line of lines) {
      const $line = cheerio.load(`<root>${line}</root>`);
      const plSpan = $line('span.pl').first();

      if (!plSpan.length) continue;

      const rawLabel = plSpan.text().trim();
      // 去掉可能的冒号和前后空格
      const label = rawLabel.replace(/[:：\s]+$/, '').trim();

      const engKey = this.keyMap[label];
      if (!engKey) continue;

      // 移除 label span，取剩余文本
      plSpan.remove();
      let value = $line('root').text().trim();

      // 优先取 <a> 链接文本（如作者、出版社等）
      const linkText = $line('a').text().trim();
      if (linkText) {
        value = linkText;
      }

      if (value) {
        info[engKey] = value;
      }
    }

    // 同时提取标题
    const title = $('h1 span[property="v:itemreviewed"]').text().trim();
    if (title) {
      info.title = title;
    }

    // 封面图
    const cover =
      $('#mainpic img').attr('src') || $('img[rel="v:image"]').attr('src');
    if (cover) {
      info.cover = cover;
    }

    return info;
  }
}
