import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CoinModel } from '../models/CoinModel.model';


@Injectable({
  providedIn: 'root'
})
export class CoinsService {

  private _coinsList: CoinModel[];
  private coinsList: BehaviorSubject<CoinModel[]>;
  apiCoinsLink: string;
  search: boolean;
  text: string;
  results: string;

  constructor(private httpClient: HttpClient) {
    this._coinsList = [];
    this.coinsList = new BehaviorSubject<CoinModel[]>([]);
    this.apiCoinsLink = 'https://api.coingecko.com/api/v3/coins/';
    this.search = false;
    this.text = "Search";
    this.results = "";
  }

  add(coin: CoinModel): void {
    if (!this._coinsList.find(data => data.symbol === coin.symbol)) {
      this._coinsList = [...this._coinsList, coin];
      this.coinsList.next(this._coinsList);
    }
  }

  gatArr(): Observable<CoinModel[]> {
    return this.coinsList;
  }

  getApi(link: string): Observable<any> {
    return this.httpClient.get<any>(link);
  }

  searchOnCoin(search: string) {
    if (this.search){
      this.getcoins(this.apiCoinsLink);
      this.text = "Search";
    }
    if (this._coinsList.find(find => find.symbol == search)&& !this.search) {
      this._coinsList = this._coinsList.filter(find => find.symbol == search)
      this.coinsList.next([...this._coinsList]);
      this.search = true;
      this.text = "Go Back To List";
      this.results = "";
    }
    else if (!this._coinsList.find(find => find.symbol == search)) {
      this.results = "No results";
    }
    else if (!search && this.search){
      this.getcoins(this.apiCoinsLink);
      this.search = false;
      this.text = "Search";
      this.results = "";
    }
    else{
      this.search = false;
      this.text = "Search";
      this.results = "";
    }
    if (!search){
      this.results = "";
    }
  }
  getcoins(api: string): void {
    this.getApi(api).subscribe((coinsData: any) => {
      for (let i = 0; i < 50; i++) {
        { this.add({ symbol: coinsData[i].symbol, id: coinsData[i].id }) }
      }
    }
    )
  }

}
