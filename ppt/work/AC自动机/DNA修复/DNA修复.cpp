#include<iostream>
#include<cstring>
#include<cstdio>
#include<queue>
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

const int inf=0x3f3f3f3f;
const int N=1005;
const int M=4;
int ch[N][M],fa[N],flg[N],tot,Case;
int n,dp[N][N],ans;

int ch2code(char tmp){
	if(tmp=='A')return 0;
	if(tmp=='G')return 1;
	if(tmp=='C')return 2;
	return 3;
}

void insert(string s){
	int u=1;
	for(int i=0,dir;i<s.length();i++){
		dir=ch2code(s[i]);
		if(!ch[u][dir])
			ch[u][dir]=++tot;
		u=ch[u][dir];
	}
	flg[u]=1;
}

void build(){
	queue<int>q;
	q.push(1);
	while(q.size()){
		int u=q.front();q.pop();
		for(int i=0,v,f;i<=3;i++){
			v=ch[u][i];f=fa[u];
			if(!v){ch[u][i]=ch[f][i]?ch[f][i]:1;continue;}
			q.push(v);
			fa[v]=ch[f][i]?ch[f][i]:1;
			flg[v]|=flg[fa[v]];
		}
	}
}

void Clear(){
	memset(ch,0,sizeof(ch));
	memset(fa,0,sizeof(fa));
	memset(flg,0,sizeof(flg));
	tot=1;
}

void Solve(){
	Clear();
	for(int i=1;i<=n;i++){
		string tmp;
		cin>>tmp;
		insert(tmp);
	}
	build();
	string t;cin>>t;t=" "+t;
	int len=t.length()-1;
	int ans=inf;
	for(int i=1;i<=len;i++)
		for(int u=1;u<=tot;u++)
			dp[i][u]=inf;
	for(int i=1;i<=len;i++){
		for(int u=1;u<=tot;u++){
			if(flg[u])continue;
			for(int k=0;k<=3;k++){
				if(flg[ch[u][k]])continue;
				dp[i][ch[u][k]]=min(dp[i][ch[u][k]],dp[i-1][u]+(k!=ch2code(t[i])));
			}
		}
	}
	for(int u=1;u<=tot;u++)
		ans=min(ans,dp[len][u]);
	Case++;
	printf("Case %d: ",Case);
	if(ans!=inf)printf("%d\n",ans);
	else printf("-1\n");
}

int main(){
	
	while(true){
		scanf("%d",&n);
		if(n==0)break;
		Solve(); 
	}
	return 0;
}

