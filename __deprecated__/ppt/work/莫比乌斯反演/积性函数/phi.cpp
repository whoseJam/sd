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
int phi[N],prim[N],vis[N],tot;

void Sieve(int n=100000){
	phi[1]=1; 
	for(int i=2;i<=n;i++){
		if(!vis[i])phi[prim[++tot]=i]=i-1;
		for(int j=1;j<=tot&&i*prim[j]<=n;j++){
			vis[i*prim[j]]=1;
			if(i%prim[j]==0){
				phi[i*prim[j]]=phi[i]*prim[j];
				break;
			}else phi[i*prim[j]]=phi[i]*(prim[j]-1);
		}
	}
} 

int main(){
	Sieve();
	cout<<phi[2]<<' '<<phi[6]<<'\n';
	return 0;
}

