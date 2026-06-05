#include<bits/stdc++.h>
using namespace std;

int read(){
	int s=0,f=1;char t=getchar();
	while('0'>t||t>'9'){
		if(t=='-')f=-1;
		t=getchar();
	}
	while('0'<=t&&t<='9'){
		s=(s<<1)+(s<<3)+t-'0';
		t=getchar();
	}
	return s*f;
}

const int N=105;
int fa[N],dis[N],n,m;

int GetFa(int x){
	if(fa[x]==x)return x;
	int tmp=fa[x];
	fa[x]=GetFa(fa[x]);
	dis[x]+=dis[tmp];
	return fa[x];
}

bool Merge(int x,int y,int d){
	int fx=GetFa(x),fy=GetFa(y);
	if(fx!=fy){
		fa[fx]=fy;
		dis[fx]=d+dis[y]-dis[x];
		return true;
	}else return dis[x]==dis[y]+d;
}

void Solve(){
	n=read();m=read();
	for(int i=0;i<=n;i++)fa[i]=i,dis[i]=0;
	bool flg=true;
	for(int i=1,s,t,w;i<=m;i++){
		// sum[t]-sum[s-1]=w
		// sum[s-1]+w=sum[t]
		// (s-1) ---w---> (t)
		s=read()-1;t=read();w=read();
		flg&=Merge(s,t,w);
	}
	if(flg)cout<<"true\n";
	else cout<<"false\n";
}

int main(){
	int Case=read();
	while(Case--)Solve();
	return 0;
}

