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

const int N=100005;
int mu[N],prim[N],vis[N],tot;

void Sieve(int n=100000){
	mu[1]=1;
	for(int i=2;i<=n;i++){
		if(!vis[i])mu[prim[++tot]=i]=-1;
		for(int j=1;j<=tot&&i*prim[j]<=n;j++){
			vis[i*prim[j]]=1;
			if(i%prim[j]==0){
				mu[i*prim[j]]=0;
				break;
			}else mu[i*prim[j]]=mu[i]*(-1);
		}
	}
} 

int main(){
	Sieve();
	cout<<mu[2]<<' '<<mu[6]<<'\n';
	return 0;
}

