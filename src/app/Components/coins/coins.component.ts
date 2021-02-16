import { Component, DoCheck, Input, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CoinInfo } from 'src/app/models/coin-info.model';
import { CoinModel } from 'src/app/models/CoinModel.model';
import { DisableService } from 'src/app/services/disable.service';
import { CoinsService } from 'src/app/services/coins.service';

@Component({
  selector: 'app-coins',
  templateUrl: './coins.component.html',
  styleUrls: ['./coins.component.css']
})
export class CoinsComponent implements OnInit, DoCheck {

  @Input() coin: CoinModel;
  press: string;
  coinInfo: CoinInfo;
  isCollapsed = true;
  disable = false;
  checked = false;
  disabled = [];

  constructor(private coinsService: CoinsService, private disableService: DisableService, config: NgbModalConfig, private modalService: NgbModal) {
    this.press = "More";
    this.coinInfo = {
      usd: null,
      ils: null,
      eur: null,
      pic: null,
      cache: 0,
      id: null
    }

  }

  ngDoCheck(): void {
    if(this.coinInfo.id && this.coinInfo.id != this.coin.id && !this.isCollapsed){
      this.coinsService.getApi(`${this.coinsService.apiCoinsLink}${this.coin.id}`).subscribe(info => {
        this.coinInfo = ({
          id: info.id,
          pic: info.image.small,
          usd: info.market_data.current_price.usd,
          ils: info.market_data.current_price.ils,
          eur: info.market_data.current_price.eur, 
          cache: Date.now()
        })}) 
    }
    if (this.disableService.disable.find(data=> data == this.coin.id)
    ){
      this.checked = true;
    }
    if (this.disableService.disable.length > 4 && !this.checked) {
      this.disable = true;
    }
    else if (this.disableService.disable.length <= 4) {
      this.disable = false;
    }
    
  }

  ngOnInit(): void {
    this.disabled = this.disableService.disable;
  }

  getInfo() {
    if (this.coinInfo.cache + 120000 < Date.now()) {
      this.coinsService.getApi(`${this.coinsService.apiCoinsLink}${this.coin.id}`).subscribe(data => {
        this.coinInfo.usd = data.market_data.current_price.usd,
          this.coinInfo.ils = data.market_data.current_price.ils,
          this.coinInfo.eur = data.market_data.current_price.eur,
          this.coinInfo.pic = data.image.small,
          this.coinInfo.id = this.coin.id;
          this.coinInfo.cache = Date.now();
      });
      this.isCollapsed = false;
      this.press = "Hide";
    }
    else if (this.isCollapsed) {
      this.isCollapsed = true;
      this.press = "More";
    }
    else {
      this.isCollapsed = false;
      this.press = "Hide";
    }
  }

  onClick() {
    if (!this.checked) {
      this.checked = true;
      this.disableService.disable.push(this.coin.id);
    }
    else {
      this.checked = false;
      this.disableService.disable.splice(this.disableService.disable.indexOf(this.coin.id), 1);
    }


  }
  open(content) {
    if (this.disableService.disable.length > 4 && this.disable) {
      this.modalService.open(content);
    }

  }
}
