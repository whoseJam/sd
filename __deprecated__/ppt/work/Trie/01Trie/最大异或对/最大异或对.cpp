#include<bits/stdc++.h>
using namespace std;
typedef unsigned int uint;

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
const int M=N*30;
int n,ch[M][2],tot=1;
uint a[N];

void insert(uint v){
	int u=1;
	for(int i=31;i>=0;i--){
		int dir=(v>>i)&1;
		if(!ch[u][dir])
			ch[u][dir]=++tot;
		u=ch[u][dir];
	}
}

uint query(uint v){
	int u=1;
	uint ans=0;
	for(int i=31;i>=0;i--){
		int dir=(v>>i)&1;
		if(ch[u][dir^1]){
			u=ch[u][dir^1];
			ans|=(1u<<i);
		}else u=ch[u][dir];
	}
	return ans;
}

int main(){
	n=read();
	for(int i=1;i<=n;i++)
		insert(a[i]=read());
	uint ans=0;
	for(int i=1;i<=n;i++)
		ans=max(ans,query(a[i]));
	cout<<ans;
	return 0;
}

