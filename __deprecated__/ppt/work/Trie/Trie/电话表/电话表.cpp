#include<iostream>
#include<cstring>
#include<cstdio>
using namespace std;

namespace FastIO{
	inline int read(){
		int s=0,f=1;char t=getchar();
		while('0'>t||t>'9'){if(t=='-')f=-1;t=getchar();}
		while('0'<=t&&t<='9'){s=(s<<1)+(s<<3)+t-'0';t=getchar();}
		return s*f;
	}
}
using FastIO::read;

const int N=100005;
const int M=15;
int ch[N][10],flg[N],tot;
int n,Ans;
char s[M];

void Clear(){
	tot=1;Ans=false;
	memset(flg,0,sizeof(flg));
	memset(ch,0,sizeof(ch));
}

void insert(){
	int len=strlen(s+1),u=1;
	for(int i=1;i<=len;i++){
		int dir=s[i]-'0';
		if(!ch[u][dir])
			ch[u][dir]=++tot;
		u=ch[u][dir];
		if(flg[u])Ans=true;
	}
	if(u!=tot)Ans=true;
	flg[u]=true;
}

void Solve(){
	Clear();n=read();
	for(int i=1;i<=n;i++){
		scanf("%s",s+1);
		insert();
	}
	if(Ans)cout<<"NO\n";
	else cout<<"YES\n";
}

int main(){
	int Case=read();
	while(Case--)Solve();
	return 0;
}
