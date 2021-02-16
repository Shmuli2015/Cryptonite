import { Component, Input, OnInit } from '@angular/core';
import { CoinModel } from 'src/app/models/CoinModel.model';
import { CoinsService } from 'src/app/services/coins.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  coinList: CoinModel[];
  coinAmount: number;

  constructor(private coinsService: CoinsService) {
  }

  ngOnInit(): void {
    this.getCoins(this.coinsService.apiCoinsLink);
    this.coinsService.gatArr().subscribe(data => {
      this.coinList = data;
    })
  }

  getCoins(api: string){
    this.coinsService.getcoins(api);
  }
}

  

