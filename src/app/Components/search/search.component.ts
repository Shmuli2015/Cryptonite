import { Component, OnInit } from '@angular/core';
import { CoinModel } from 'src/app/models/CoinModel.model';
import { CoinsService} from 'src/app/services/coins.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  coin: CoinModel;
  coinsList: CoinModel[];
  results: string;
  search: string;

  constructor(private coinsService: CoinsService) { 

    this.coinsList = [];
  }
  ngDoCheck(): void {
    this.search = this.coinsService.text;
    this.results = this.coinsService.results;
  }

  ngOnInit(): void {
    this.coinsService.gatArr().subscribe(data=> {
      this.coinsList = data;
    })

  }

  searchOnCoin(search: string): void {
    this.coinsService.searchOnCoin(search);

  }
}
