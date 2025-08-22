import axios from "axios";

interface AdwiseClientConfig {
  apiKey: string;
  baseUrl?: string;
  rotationInterval?: number;
  width?: number;
  height?: number;
}

interface Campaign {
  _id: string;
  title: string;
  description?: string;
  mediaUrls: string[];
  destinationUrl?: string;
  audience?: string;
  mediaTitle?: string;
  width?: number;
  height?: number;
}

interface DisplayAd extends Omit<Campaign, 'mediaUrls'> {
  currentMediaUrl: string;
  mediaIndex: number;
  totalMedia: number;
  displayWidth: number;
  displayHeight: number;
}

class AdwiseClient {
  private config: {
    apiKey: string;
    baseUrl: string;
    rotationInterval: number;
    defaultWidth: number;
    defaultHeight: number;
    currentAdIndex: number;
    currentMediaIndex: number;
    ads: Campaign[];
    rotationTimer: NodeJS.Timeout | null;
  };

  private subscribers: ((ad: DisplayAd | null) => void)[] = [];

  constructor(config: AdwiseClientConfig) {
    this.config = {
      apiKey: config.apiKey,
      baseUrl: config.baseUrl || 'http://localhost:5000',
      rotationInterval: config.rotationInterval || 30000,
      defaultWidth: config.width || 300,
      defaultHeight: config.height || 250,
      currentAdIndex: 0,
      currentMediaIndex: 0,
      ads: [],
      rotationTimer: null
    };
  }

  subscribe(callback: (ad: DisplayAd | null) => void): void {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: (ad: DisplayAd | null) => void): void {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
  }

  private notifySubscribers(): void {
    const currentAd = this.getCurrentAd();
    this.subscribers.forEach(callback => callback(currentAd));
  }

  async fetchAds(): Promise<Campaign[]> {
    try {
      const response = await axios.get(`${this.config.baseUrl}/api/v1/ad/campaigns`, {
        headers: { 'x-api-key': this.config.apiKey }
      });
      
      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = response.data;
      
      if (!data.success || !data.campaigns) {
        throw new Error('Invalid response format');
      }
      
      return data.campaigns;
    } catch (error) {
      console.error('Ad fetch failed:', error);
      return [];
    }
  }

  private startRotation(): void {
    this.config.rotationTimer = setInterval(() => {
      this.rotateAd();
    }, this.config.rotationInterval);
  }

  async initialize(): Promise<boolean> {
    this.config.ads = await this.fetchAds();
    
    if (this.config.ads.length > 0) {
      if (this.config.ads.length > 1) {
        this.startRotation();
      }
      this.notifySubscribers();
      return true;
    }
    return false;
  }

  getCurrentAd(): DisplayAd | null {
    if (this.config.ads.length === 0) return null;
    
    const ad = this.config.ads[this.config.currentAdIndex];
    
    const displayWidth = ad.width || this.config.defaultWidth;
    const displayHeight = ad.height || this.config.defaultHeight;

    // Create cache-busted URL
    const mediaUrl = new URL(ad.mediaUrls[this.config.currentMediaIndex]);
    mediaUrl.searchParams.set('t', Date.now().toString());
    
    return {
      ...ad,
      currentMediaUrl: mediaUrl.toString(),
      mediaIndex: this.config.currentMediaIndex,
      totalMedia: ad.mediaUrls.length,
      displayWidth,
      displayHeight
    };
  }

  rotateMedia(): void {
    if (this.config.ads.length === 0) return;
    
    const ad = this.config.ads[this.config.currentAdIndex];
    this.config.currentMediaIndex = 
      (this.config.currentMediaIndex + 1) % ad.mediaUrls.length;
    this.notifySubscribers();
  }

  private rotateAd(): void {
    if (this.config.ads.length === 0) return;
    
    this.config.currentAdIndex = 
      (this.config.currentAdIndex + 1) % this.config.ads.length;
    this.config.currentMediaIndex = 0;
    
    this.notifySubscribers();
  }

  destroy(): void {
    if (this.config.rotationTimer) {
      clearInterval(this.config.rotationTimer);
    }
    this.subscribers = [];
  }

  updateDimensions(width: number, height: number): void {
    this.config.defaultWidth = width;
    this.config.defaultHeight = height;
    this.notifySubscribers();
  }

  private getRandomAd(): DisplayAd | null {
    if (this.config.ads.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * this.config.ads.length);
    const ad = this.config.ads[randomIndex];

    const displayWidth = ad.width || this.config.defaultWidth;
    const displayHeight = ad.height || this.config.defaultHeight;

    // Cache-bust random ad too
    const mediaUrl = new URL(ad.mediaUrls[0]);
    mediaUrl.searchParams.set('t', Date.now().toString());

    return {
      ...ad,
      currentMediaUrl: mediaUrl.toString(),
      mediaIndex: 0,
      totalMedia: ad.mediaUrls.length,
      displayWidth,
      displayHeight
    };
  }

  initiateRandomAd(): void {
    const ad = this.getRandomAd();
    if (!ad) {
      console.warn("No ads available to display.");
      return;
    }

    const modal = document.createElement("div");
    modal.id = "adwise-modal";
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,0.6)";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.zIndex = "9999";

    const content = document.createElement("div");
    content.style.background = "#fff";
    content.style.borderRadius = "10px";
    content.style.padding = "20px";
    content.style.textAlign = "center";
    content.style.maxWidth = ad.displayWidth + "px";
    content.style.maxHeight = ad.displayHeight + "px";

    if (ad.title) {
      const title = document.createElement("h2");
      title.innerText = ad.title;
      content.appendChild(title);
    }

    const img = document.createElement("img");
    img.src = ad.currentMediaUrl;
    img.alt = ad.mediaTitle || ad.title || "Ad";
    img.style.maxWidth = "100%";
    img.style.borderRadius = "8px";
    content.appendChild(img);

    if (ad.destinationUrl) {
      const button = document.createElement("a");
      button.href = ad.destinationUrl;
      button.target = "_blank";
      button.innerText = "Learn More";
      button.style.display = "inline-block";
      button.style.marginTop = "12px";
      button.style.padding = "10px 16px";
      button.style.background = "#007bff";
      button.style.color = "#fff";
      button.style.borderRadius = "6px";
      button.style.textDecoration = "none";
      content.appendChild(button);
    }

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "×";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "20px";
    closeBtn.style.right = "30px";
    closeBtn.style.fontSize = "24px";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.color = "#fff";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => document.body.removeChild(modal);
    modal.appendChild(closeBtn);

    modal.appendChild(content);
    document.body.appendChild(modal);
  }
}

export default AdwiseClient;