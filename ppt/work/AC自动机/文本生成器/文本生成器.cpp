#include<iostream>
#include<cstring>
#include<cstdio>
#include<queue>
using namespace std;

const int N=6005;
const int Mod=10007;
int n,m,dp[105][N][2],Ans;

struct Trie{
	int ch[26],fail;
	bool End;
}t[N];
int cnt=1;

void Insert(string s){
	int u=1;
	for(int i=0,v;i<s.length();i++){
		v=s[i]-'A';
		if(!t[u].ch[v])t[u].ch[v]=++cnt;
		u=t[u].ch[v];
	}
	t[u].End=1;
}

void getFail(){
	queue<int>q;q.push(1);
	while(q.size()){
		int u=q.front();q.pop();
		for(int i=0,v,f;i<26;i++){
			v=t[u].ch[i];f=t[u].fail;
			if(!v){t[u].ch[i]=t[f].ch[i]?t[f].ch[i]:1;continue;}
			q.push(v);
			t[v].fail=t[f].ch[i]?t[f].ch[i]:1;
			t[v].End|=t[t[v].fail].End;
		}
	}
}

int main(){
	string s;
	cin>>n>>m;
	for(int i=1;i<=n;i++){
		cin>>s;
		Insert(s);
	}
	getFail();
	dp[0][1][0]=1;
	for(int i=0;i<m;i++){
		for(int u=1;u<=cnt;u++){
			for(int j=0,v;j<26;j++){
				v=t[u].ch[j];
				for(int fla=0;fla<=1;fla++){
					dp[i+1][v][fla|t[v].End]+=dp[i][u][fla];
					dp[i+1][v][fla|t[v].End]%=Mod;
				}
			}
		}
	}
	for(int i=1;i<=cnt;i++){
		Ans+=dp[m][i][1];
		Ans%=Mod;
	}
	printf("%d",Ans);
	return 0;
}
